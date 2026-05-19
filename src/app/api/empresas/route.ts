import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const list = await dbService.getEmpresas();
    return NextResponse.json(list);
  } catch (error: any) {
    console.error("[API Empresas] GET error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar lista de filiais." },
      { status: 500 }
    );
  }
}
