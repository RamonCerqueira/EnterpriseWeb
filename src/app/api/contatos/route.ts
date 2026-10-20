import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

function canManage(session: Awaited<ReturnType<typeof getSession>>) {
  return session && (session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op3"]);
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await dbService.getContatos({ search: searchParams.get("search") || undefined, page: Number(searchParams.get("page")) || 1, limit: Number(searchParams.get("limit")) || 25 }));
  } catch { return NextResponse.json({ error: "Falha ao obter contatos." }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!canManage(session)) return NextResponse.json({ error: "Acesso negado." }, { status: session ? 403 : 401 });
  const body = await request.json();
  if (!body.contato?.trim()) return NextResponse.json({ error: "O nome do contato é obrigatório." }, { status: 400 });
  try { return NextResponse.json({ success: true, contato: await dbService.createContato(body) }); }
  catch { return NextResponse.json({ error: "Falha ao cadastrar contato." }, { status: 500 }); }
}
