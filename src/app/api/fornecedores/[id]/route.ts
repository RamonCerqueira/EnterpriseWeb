import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Código do fornecedor inválido." }, { status: 400 });
    }

    const data = await req.json();
    const updated = await dbService.updateFornecedor(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[SoftLine API] PUT fornecedor error:", error);
    return NextResponse.json({ error: "Falha ao atualizar fornecedor." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Código do fornecedor inválido." }, { status: 400 });
    }

    const result = await dbService.deleteFornecedor(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[SoftLine API] DELETE fornecedor error:", error);
    return NextResponse.json({ error: "Falha ao excluir fornecedor." }, { status: 500 });
  }
}
