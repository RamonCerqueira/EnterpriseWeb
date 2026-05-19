import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/schemas";

export async function GET() {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const products = await dbService.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("[SoftLine API] GET products error:", error);
    return NextResponse.json({ error: "Falha ao obter produtos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Ensure user has permission to manage products (Op5/Op6 are Products/Produto, Op91 is Admin)
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op5"] || session.permissions["Op6"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar produtos." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate with Zod
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Create product in database (Prisma or mock fallback)
    const newProd = await dbService.createProduct(validation.data);

    return NextResponse.json({ success: true, product: newProd });
  } catch (error) {
    console.error("[SoftLine API] POST products error:", error);
    return NextResponse.json({ error: "Falha ao criar produto." }, { status: 500 });
  }
}
