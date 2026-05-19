import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission check
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op3"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar clientes." },
        { status: 403 }
      );
    }

    const codCli = parseInt(params.id);
    if (isNaN(codCli)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await req.json();
    const updated = await dbService.updateCliente(codCli, body);
    return NextResponse.json({ success: true, cliente: updated });
  } catch (error) {
    console.error("[SoftLine API] PUT cliente error:", error);
    return NextResponse.json({ error: "Falha ao atualizar cliente." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission check
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op3"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar clientes." },
        { status: 403 }
      );
    }

    const codCli = parseInt(params.id);
    if (isNaN(codCli)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    await dbService.deleteCliente(codCli);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SoftLine API] DELETE cliente error:", error);
    return NextResponse.json({ error: "Falha ao excluir cliente." }, { status: 500 });
  }
}
