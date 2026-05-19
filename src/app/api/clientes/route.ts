import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const statusFilter = searchParams.get("statusFilter") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await dbService.getClientes({
      search,
      statusFilter,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[SoftLine API] GET clientes error:", error);
    return NextResponse.json({ error: "Falha ao obter clientes." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission check: Op3 is Clientes, Op91 is Admin Geral
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op3"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar clientes." },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.cliente && !body.razao) {
      return NextResponse.json({ error: "Nome Fantasia / Cliente ou Razão Social é obrigatório." }, { status: 400 });
    }

    const newCli = await dbService.createCliente(body);
    return NextResponse.json({ success: true, cliente: newCli });
  } catch (error) {
    console.error("[SoftLine API] POST clientes error:", error);
    return NextResponse.json({ error: "Falha ao cadastrar cliente." }, { status: 500 });
  }
}
