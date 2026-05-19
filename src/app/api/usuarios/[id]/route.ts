import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission checks - Op8 is Senha, Op91 is Admin Geral
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op8"];
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar usuários." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const codUsu = parseInt(id);
    if (isNaN(codUsu)) {
      return NextResponse.json({ error: "ID de usuário inválido." }, { status: 400 });
    }

    const body = await req.json();

    // 1. Update system user (Senha table)
    const updatedUser = await dbService.updateUser(codUsu, {
      ...body,
      nome: body.nome,
      usuario: body.usuario,
      senha: body.senha,
      role: body.role,
      inativo: body.inativo,
      permissions: body.permissions,
    });

    // 2. Update or create matched collaborator (Indicado table)
    let updatedCol = null;
    if (body.colaboradorId) {
      // Existing collaborator - update it
      updatedCol = await dbService.updateCollaborator(parseInt(body.colaboradorId), {
        ...body,
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cargo: body.cargo,
        situacao: body.inativo ? "I" : "A", // Inactivate collaborator if user is inactivated
      });
    } else if (body.criarColaborador) {
      // Toggled on during edit - create new collaborator record
      updatedCol = await dbService.createCollaborator({
        ...body,
        nome: body.nome,
        email: body.email || "",
        telefone: body.telefone || "",
        cargo: body.cargo || "Colaborador",
        indicado: true,
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      colaborador: updatedCol,
    });
  } catch (error: any) {
    console.error("[SoftLine API] PUT usuarios/:id error:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao atualizar dados do usuário." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Permission checks - Op8 is Senha, Op91 is Admin Geral
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op8"];
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para gerenciar usuários." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const codUsu = parseInt(id);
    if (isNaN(codUsu)) {
      return NextResponse.json({ error: "ID de usuário inválido." }, { status: 400 });
    }

    // Check if we should also delete a linked collaborator
    const url = new URL(req.url);
    const colaboradorIdStr = url.searchParams.get("colaboradorId");

    // 1. Delete user account from Senha table
    await dbService.deleteUser(codUsu);

    // 2. Delete matched collaborator if specified
    if (colaboradorIdStr) {
      const codInd = parseInt(colaboradorIdStr);
      if (!isNaN(codInd)) {
        try {
          await dbService.deleteCollaborator(codInd);
        } catch (colErr) {
          console.error("[SoftLine API] Failed to delete linked collaborator:", colErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SoftLine API] DELETE usuarios/:id error:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao excluir usuário." },
      { status: 500 }
    );
  }
}
