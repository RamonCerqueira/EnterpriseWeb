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
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const result = await dbService.getCompras({
      search,
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Compras] GET error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar faturamentos de compras." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { codFor, nf, status, items } = body;

    if (!codFor || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "O fornecedor e os itens de reabastecimento são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await dbService.createCompra({
      codFor,
      nf,
      status,
      items
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Compras] POST error:", error);
    return NextResponse.json(
      { error: "Erro de transação ao registrar entrada física de mercadoria." },
      { status: 500 }
    );
  }
}
