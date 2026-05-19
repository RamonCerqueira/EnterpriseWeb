import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const statusFilter = searchParams.get("statusFilter") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await dbService.getServices({
      search,
      category,
      statusFilter,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[SoftLine API] GET servicos error:", error);
    return NextResponse.json({ error: "Falha ao obter serviços." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op5"] || session.permissions["Op6"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar serviços." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Zod validation checks (shares schema with product)
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const newServ = await dbService.createService(validation.data);
    return NextResponse.json({ success: true, service: newServ });
  } catch (error) {
    console.error("[SoftLine API] POST servicos error:", error);
    return NextResponse.json({ error: "Falha ao registrar serviço." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op5"] || session.permissions["Op6"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar serviços." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...data } = body;
    const codPro = parseInt(id);

    if (isNaN(codPro)) {
      return NextResponse.json({ error: "ID do serviço inválido." }, { status: 400 });
    }

    const validation = productSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const updated = await dbService.updateProduct(codPro, validation.data);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("[SoftLine API] PUT servicos error:", error);
    return NextResponse.json({ error: "Falha ao atualizar serviço." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op5"] || session.permissions["Op6"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar serviços." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID do serviço inválido." }, { status: 400 });
    }

    await dbService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SoftLine API] DELETE servicos error:", error);
    return NextResponse.json({ error: "Falha ao excluir serviço." }, { status: 500 });
  }
}
