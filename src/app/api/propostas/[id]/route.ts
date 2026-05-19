import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const pedidoId = Number(id);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: "Código de pedido inválido." }, { status: 400 });
    }

    const proposta = await dbService.getPropostaById(pedidoId);
    if (!proposta) {
      return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
    }

    return NextResponse.json(proposta);
  } catch (error: any) {
    console.error("[API Propostas ID] GET error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao buscar detalhes da proposta." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const pedidoId = Number(id);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: "Código de pedido inválido." }, { status: 400 });
    }

    const body = await req.json();
    const data = {
      ...body,
      usuario: session.username || "softline",
      codUsu: session.userId || 999,
    };

    const res = await dbService.updateProposta(pedidoId, data);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("[API Propostas ID] PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao gravar alterações da proposta." },
      { status: 500 }
    );
  }
}
