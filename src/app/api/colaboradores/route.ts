import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { collaboratorSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const collaborators = await dbService.getCollaborators();
    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("[SoftLine API] GET colaboradores error:", error);
    return NextResponse.json({ error: "Falha ao obter colaboradores." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission checks - Op34 is Cadastro de Indicador, Op91 is Admin Geral
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op34"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar colaboradores." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Zod validation checks
    const validation = collaboratorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const newCol = await dbService.createCollaborator({ ...validation.data, ...body });
    return NextResponse.json({ success: true, collaborator: newCol });
  } catch (error) {
    console.error("[SoftLine API] POST colaboradores error:", error);
    return NextResponse.json({ error: "Falha ao cadastrar colaborador." }, { status: 500 });
  }
}
