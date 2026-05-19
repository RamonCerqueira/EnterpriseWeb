import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await dbService.getMovimentacoesEstoque(limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Movimentacoes] GET error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar o histórico de movimentações." },
      { status: 500 }
    );
  }
}
