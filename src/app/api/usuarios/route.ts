import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";
import { userSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const users = await dbService.getUsers();
    const collaborators = await dbService.getCollaborators();

    // Merge users and collaborators by name matching (case-insensitive and trimmed)
    const merged = users.map(user => {
      const col = collaborators.find(
        c => c.nome.toLowerCase().trim() === user.nome.toLowerCase().trim() ||
             c.nome.toLowerCase().trim() === user.usuario.toLowerCase().trim()
      );
      return {
        ...user,
        colaborador: col || null
      };
    });

    return NextResponse.json(merged);
  } catch (error) {
    console.error("[SoftLine API] GET usuarios error:", error);
    return NextResponse.json({ error: "Falha ao obter usuários." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Auth validation - Op8 is Senha, Op91 is Admin Geral
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op8"];
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar usuários." },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate the core user fields
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: validation.error.format() },
        { status: 400 }
      );
    }

    const newUser = await dbService.createUser({ ...validation.data, ...body });

    // If indicated, create matching collaborator record
    let newCol = null;
    if (body.criarColaborador) {
      try {
        newCol = await dbService.createCollaborator({
          ...body,
          nome: body.nome,
          email: body.email || "",
          telefone: body.telefone || "",
          cargo: body.cargo || "Colaborador",
          indicado: true
        });
      } catch (colErr) {
        console.error("[SoftLine API] Failed to create matched collaborator:", colErr);
        // We don't fail the user creation if collaborator fails, but log it
      }
    }

    return NextResponse.json({ success: true, user: newUser, colaborador: newCol });
  } catch (error) {
    console.error("[SoftLine API] POST usuarios error:", error);
    return NextResponse.json({ error: "Falha ao registrar conta de usuário." }, { status: 500 });
  }
}
