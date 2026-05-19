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

    const result = await dbService.getFornecedores({
      search,
      statusFilter,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[SoftLine API] GET fornecedores error:", error);
    return NextResponse.json({ error: "Falha ao obter fornecedores." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const data = await req.json();
    if (!data.fornec) {
      return NextResponse.json({ error: "O nome do fornecedor é obrigatório." }, { status: 400 });
    }

    const newFor = await dbService.createFornecedor(data);
    return NextResponse.json(newFor, { status: 201 });
  } catch (error) {
    console.error("[SoftLine API] POST fornecedores error:", error);
    return NextResponse.json({ error: "Falha ao criar fornecedor." }, { status: 500 });
  }
}
