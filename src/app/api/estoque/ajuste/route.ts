import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { codPro, novoEstoque } = body;

    if (codPro === undefined || novoEstoque === undefined) {
      return NextResponse.json(
        { error: "Código do produto e novo saldo de estoque são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await dbService.realizarAjusteEstoque(
      Number(codPro),
      Number(novoEstoque)
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Ajuste] POST error:", error);
    return NextResponse.json(
      { error: "Erro interno ao realizar ajuste físico de estoque no banco." },
      { status: 500 }
    );
  }
}
