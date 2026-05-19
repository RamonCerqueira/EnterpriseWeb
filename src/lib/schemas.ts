import { z } from "zod";

// User / Senha table schema
export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve conter pelo menos 3 caracteres"),
  usuario: z
    .string()
    .min(3, "O usuário deve conter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z0-9_\-]+$/, "O usuário deve conter apenas letras, números, hífen ou underline"),
  senha: z.string().min(4, "A senha deve conter pelo menos 4 caracteres"),
  role: z.string().default("Administrador"),
  permissions: z.record(z.string(), z.union([z.boolean(), z.string()])).default({}),
});

// Collaborator / Indicado table schema
export const collaboratorSchema = z.object({
  nome: z.string().min(3, "O nome do colaborador deve conter pelo menos 3 caracteres"),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  telefone: z
    .string()
    .optional()
    .or(z.literal("")),
  cargo: z
    .string()
    .optional()
    .or(z.literal("")),
  indicado: z.boolean().default(true),
});

// Product / Produto table schema
export const productSchema = z.object({
  nome: z.string().min(2, "O nome do produto deve conter pelo menos 2 caracteres"),
  codigo: z
    .string()
    .min(2, "O código deve conter pelo menos 2 caracteres")
    .toUpperCase(),
  preco: z.coerce.number().min(0, "O preço não pode ser negativo"),
  estoque: z.coerce.number().min(0, "O estoque não pode ser negativo"),
  categoria: z.string().min(2, "Selecione uma categoria válida"),
  descricao: z
    .string()
    .optional()
    .or(z.literal("")),
  
  // Novos campos para suporte ao cadastro completo
  abreviado: z.string().optional().or(z.literal("")),
  marca: z.string().optional().or(z.literal("")),
  fabricante: z.string().optional().or(z.literal("")),
  codigoBarras: z.string().optional().or(z.literal("")),
  unidade: z.string().optional().or(z.literal("")),
  inativo: z.union([z.boolean(), z.string()]).optional(),
  
  preco2: z.coerce.number().optional().nullable(),
  preco3: z.coerce.number().optional().nullable(),
  preco4: z.coerce.number().optional().nullable(),
  custo: z.coerce.number().optional().nullable(),
  custoInformado: z.coerce.number().optional().nullable(),
  custoTabela: z.coerce.number().optional().nullable(),
  medio: z.coerce.number().optional().nullable(),
  ultimo: z.coerce.number().optional().nullable(),
  markupTabela: z.coerce.number().optional().nullable(),
  descontoMaximo: z.coerce.number().optional().nullable(),
  comissao: z.coerce.number().optional().nullable(),
  
  minimo: z.coerce.number().optional().nullable(),
  estoqueMaximo: z.coerce.number().optional().nullable(),
  localizacao: z.string().optional().or(z.literal("")),
  peso: z.coerce.number().optional().nullable(),
  pesoLiquido: z.coerce.number().optional().nullable(),
  largura: z.coerce.number().optional().nullable(),
  altura: z.coerce.number().optional().nullable(),
  comprimento: z.coerce.number().optional().nullable(),
  area: z.coerce.number().optional().nullable(),
  areaM3: z.coerce.number().optional().nullable(),
  
  classificacaoFiscal: z.string().optional().or(z.literal("")),
  csosn: z.string().optional().or(z.literal("")),
  cfopVenda: z.string().optional().or(z.literal("")),
  cfopCompra: z.string().optional().or(z.literal("")),
  ipi: z.coerce.number().optional().nullable(),
  icms: z.coerce.number().optional().nullable(),
  frete: z.coerce.number().optional().nullable(),
  
  obs: z.string().optional().or(z.literal("")),
  aplicacao: z.string().optional().or(z.literal("")),
  caracteristicas: z.string().optional().or(z.literal("")),
  balancoAuditoria: z.coerce.number().optional().nullable(),
  diasGarantia: z.coerce.number().int().optional().nullable(),
  eCommerce: z.union([z.boolean(), z.string()]).optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type CollaboratorInput = z.infer<typeof collaboratorSchema>;
export type ProductInput = z.infer<typeof productSchema>;
