import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  const userId = Number(id);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  if (!Number.isInteger(userId) || (session.id !== userId && session.role !== "Administrador" && !session.permissions.Op91)) {
    return NextResponse.json({ error: "Sem permissão para alterar esta foto." }, { status: 403 });
  }

  const { image } = await req.json();
  const match = typeof image === "string" && image.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_IMAGE_SIZE) return NextResponse.json({ error: "A foto deve ter no máximo 2 MB." }, { status: 400 });

  const relativePath = `/uploads/perfis/${userId}.jpg`;
  const folder = path.join(process.cwd(), "public", "uploads", "perfis");
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, `${userId}.jpg`), bytes);
  await prisma.senha.update({ where: { CodUsu: userId }, data: { Caminho: relativePath } });

  if (session.id === userId) await setSession({ ...session, foto: relativePath });
  return NextResponse.json({ foto: `${relativePath}?v=${Date.now()}` });
}
