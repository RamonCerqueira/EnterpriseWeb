import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const onlyCritical = searchParams.get("onlyCritical") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const result = await dbService.getEstoqueProdutos({
      search,
      onlyCritical,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Estoque] GET error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar dados de estoque do banco." },
      { status: 500 }
    );
  }
}
