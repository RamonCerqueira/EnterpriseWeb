import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usuario, senha } = body;

    if (!usuario || !senha) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Authenticate user (attempts SQL Server 'senha' table, falls back to persistent mock-db.json)
    const user = await dbService.authenticateUser(usuario, senha);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas. Usuário ou senha incorretos." },
        { status: 401 }
      );
    }

    // Store secure session cookie
    await setSession({
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      role: user.role,
      permissions: user.permissions,
    });

    console.log(`[SoftLine API] Session created for '${user.usuario}' (${user.nome})`);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[SoftLine API] Login endpoint error:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}
