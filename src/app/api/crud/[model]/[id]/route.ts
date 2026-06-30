import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import modelsMetadata from "@/lib/models-metadata.json";

interface MetadataField {
  name: string;
  type: string;
  isNullable: boolean;
  isList: boolean;
  isId: boolean;
  isAutoincrement: boolean;
}

interface ModelMetadata {
  name: string;
  dbMap: string;
  primaryKey: {
    field: string;
    type: string;
    isCompound: boolean;
  };
  fields: MetadataField[];
}

function parseId(idStr: string, pkType: string): any {
  if (pkType === "Int") {
    const parsed = parseInt(idStr, 10);
    if (isNaN(parsed)) throw new Error("ID inválido (esperado inteiro).");
    return parsed;
  }
  if (pkType === "Float" || pkType === "Decimal") {
    const parsed = parseFloat(idStr);
    if (isNaN(parsed)) throw new Error("ID inválido (esperado float/decimal).");
    return parsed;
  }
  return idStr; // String pk
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { model, id } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada.` }, { status: 404 });
    }

    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    let parsedId;
    try {
      parsedId = parseId(id, metadata.primaryKey.type);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const item = await delegate.findUnique({
      where: {
        [metadata.primaryKey.field]: parsedId
      }
    });

    if (!item) {
      return NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("[CRUD API GET ID Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao obter registro." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const isAdmin = session.role === "Administrador" || session.permissions["Op91"];
    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores podem fazer alterações." }, { status: 403 });
    }

    const { model, id } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada.` }, { status: 404 });
    }

    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    let parsedId;
    try {
      parsedId = parseId(id, metadata.primaryKey.type);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const body = await req.json();
    const data: any = {};

    // Cast fields to correct types
    for (const field of metadata.fields) {
      // Do not include primary key field in update data body
      if (field.isId) {
        continue;
      }

      const val = body[field.name];

      if (val === undefined || val === null || val === "") {
        if (field.isNullable) {
          data[field.name] = null;
        }
        continue;
      }

      if (field.type === "Int") {
        const parsed = parseInt(val, 10);
        data[field.name] = isNaN(parsed) ? 0 : parsed;
      } else if (field.type === "Float" || field.type === "Decimal") {
        const parsed = parseFloat(val);
        data[field.name] = isNaN(parsed) ? 0.0 : parsed;
      } else if (field.type === "Boolean") {
        data[field.name] = val === true || val === "true" || val === 1 || val === "1";
      } else if (field.type === "DateTime") {
        data[field.name] = new Date(val);
      } else {
        data[field.name] = String(val);
      }
    }

    const updatedItem = await delegate.update({
      where: {
        [metadata.primaryKey.field]: parsedId
      },
      data
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error: any) {
    console.error("[CRUD API PUT ID Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao atualizar registro." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const isAdmin = session.role === "Administrador" || session.permissions["Op91"];
    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores podem fazer exclusões." }, { status: 403 });
    }

    const { model, id } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada.` }, { status: 404 });
    }

    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    let parsedId;
    try {
      parsedId = parseId(id, metadata.primaryKey.type);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    await delegate.delete({
      where: {
        [metadata.primaryKey.field]: parsedId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CRUD API DELETE ID Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao excluir registro. Pode haver chaves estrangeiras vinculadas." }, { status: 500 });
  }
}
