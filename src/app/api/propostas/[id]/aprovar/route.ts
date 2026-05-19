import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function POST(
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

    const res = await dbService.approveProposta(pedidoId);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("[API Propostas Aprovar] POST error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao aprovar proposta comercial." },
      { status: 500 }
    );
  }
}
