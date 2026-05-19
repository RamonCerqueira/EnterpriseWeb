import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const propostas = await dbService.getPropostas();
    return NextResponse.json(propostas);
  } catch (error: any) {
    console.error("[API Propostas] GET error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao buscar lista de propostas." },
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
    const data = {
      ...body,
      usuario: session.username || "softline",
      codUsu: session.userId || 999,
    };

    const res = await dbService.createProposta(data);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("[API Propostas] POST error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao gravar proposta comercial." },
      { status: 500 }
    );
  }
}
