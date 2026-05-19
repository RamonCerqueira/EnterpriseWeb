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
  preco: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
  estoque: z.coerce.number().int("O estoque deve ser um número inteiro").min(0, "O estoque não pode ser negativo"),
  categoria: z.string().min(2, "Selecione uma categoria válida"),
  descricao: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type UserInput = z.infer<typeof userSchema>;
export type CollaboratorInput = z.infer<typeof collaboratorSchema>;
export type ProductInput = z.infer<typeof productSchema>;
