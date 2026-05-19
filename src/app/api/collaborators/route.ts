import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { collaboratorSchema } from "@/lib/schemas";

export async function GET() {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const collaborators = await dbService.getCollaborators();
    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("[SoftLine API] GET collaborators error:", error);
    return NextResponse.json({ error: "Falha ao obter colaboradores." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Ensure user has permission to view/register collaborators (Op34 is Cadastro de Indicador, Op91 is Admin)
    const canManage = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op34"];
    if (!canManage) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar colaboradores (indicados)." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate with Zod
    const validation = collaboratorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    // Create collaborator in database (Prisma or mock fallback)
    const newCol = await dbService.createCollaborator(validation.data);

    return NextResponse.json({ success: true, collaborator: newCol });
  } catch (error) {
    console.error("[SoftLine API] POST collaborators error:", error);
    return NextResponse.json({ error: "Falha ao criar colaborador." }, { status: 500 });
  }
}
