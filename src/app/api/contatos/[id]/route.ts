import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";
import { getSession } from "@/lib/auth";

async function authorized() {
  const session = await getSession();
  return session && (session.role === "Administrador" || session.permissions["Op91"] || session.permissions["Op3"]);
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await authorized()) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  const id = Number((await params).id); if (!Number.isInteger(id)) return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  try { return NextResponse.json({ success: true, contato: await dbService.updateContato(id, await request.json()) }); }
  catch { return NextResponse.json({ error: "Falha ao atualizar contato." }, { status: 500 }); }
}
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await authorized()) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  const id = Number((await params).id); if (!Number.isInteger(id)) return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  try { await dbService.deleteContato(id); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: "Falha ao excluir contato." }, { status: 500 }); }
}
