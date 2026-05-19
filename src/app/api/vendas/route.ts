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

    const result = await dbService.getVendas({
      search,
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Vendas] GET error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar faturamentos de vendas." },
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
    const { codCli, clienteName, status, items } = body;

    if (!clienteName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "O nome do cliente e os itens da venda são obrigatórios." },
        { status: 400 }
      );
    }

    // Set seller/representative ID from session
    const codRep = session.id;

    const result = await dbService.createVenda({
      codCli,
      clienteName,
      status,
      codRep,
      items
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Vendas] POST error:", error);
    return NextResponse.json(
      { error: "Erro de transação ao registrar faturamento comercial." },
      { status: 500 }
    );
  }
}
