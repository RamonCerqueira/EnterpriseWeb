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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { model } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada ou não é gerenciável.` }, { status: 404 });
    }

    // Map Prisma key (lowercase first char)
    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build dynamic search filter across all String fields
    const where: any = {};
    if (search.trim()) {
      const stringFields = metadata.fields.filter(f => f.type === "String");
      if (stringFields.length > 0) {
        where.OR = stringFields.map(f => ({
          [f.name]: {
            contains: search.trim()
          }
        }));
      }
    }

    // Fetch total count and items in parallel
    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [metadata.primaryKey.field]: "desc"
        }
      }),
      delegate.count({ where })
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("[CRUD API GET Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao buscar registros da tabela." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Only administrators or supervisors can make changes to tables directly
    const isAdmin = session.role === "Administrador" || session.permissions["Op91"];
    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores podem fazer alterações." }, { status: 403 });
    }

    const { model } = await params;
    const metadata = (modelsMetadata as Record<string, ModelMetadata>)[model];
    if (!metadata) {
      return NextResponse.json({ error: `Tabela '${model}' não encontrada.` }, { status: 404 });
    }

    const prismaKey = model.charAt(0).toLowerCase() + model.slice(1);
    const delegate = (prisma as any)[prismaKey];
    if (!delegate) {
      return NextResponse.json({ error: `Modelo '${model}' não mapeado no Prisma Client.` }, { status: 404 });
    }

    const body = await req.json();
    const data: any = {};

    // Cast fields to correct types
    for (const field of metadata.fields) {
      // If it is autoincrement ID, skip letting database handle it
      if (field.isId && field.isAutoincrement) {
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

    const newItem = await delegate.create({ data });
    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("[CRUD API POST Error]:", error);
    return NextResponse.json({ error: error.message || "Erro ao criar registro." }, { status: 500 });
  }
}
