import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const codEmp = parseInt(params.id);
    if (isNaN(codEmp)) {
      return NextResponse.json({ error: "Código da empresa inválido." }, { status: 400 });
    }

    const emp = await dbService.getEmpresaById(codEmp);
    if (!emp) {
      return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 });
    }

    return NextResponse.json(emp);
  } catch (error: any) {
    console.error(`[API Empresas ID] GET error for ${params.id}:`, error);
    return NextResponse.json(
      { error: "Erro interno ao buscar detalhes do cadastro." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const codEmp = parseInt(params.id);
    if (isNaN(codEmp)) {
      return NextResponse.json({ error: "Código da empresa inválido." }, { status: 400 });
    }

    const body = await req.json();
    const result = await dbService.updateEmpresa(codEmp, body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`[API Empresas ID] PUT error for ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || "Erro de transação ao gravar alterações cadastrais." },
      { status: 500 }
    );
  }
}
