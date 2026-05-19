import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { userSchema } from "@/lib/schemas";

export async function GET() {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const users = await dbService.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("[SoftLine API] GET users error:", error);
    return NextResponse.json({ error: "Falha ao obter usuários." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Ensure they have permission to manage users (Op8 is Senha, Op91 is Admin)
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op8"];
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar usuários." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate with Zod
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Create user in database (Prisma or mock fallback)
    const newUser = await dbService.createUser(validation.data);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("[SoftLine API] POST users error:", error);
    return NextResponse.json({ error: "Falha ao criar usuário." }, { status: 500 });
  }
}
