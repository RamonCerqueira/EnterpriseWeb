export class CrudValidationError extends Error {}

export function decodeCrudImage(value: unknown): Buffer {
  if (typeof value !== "string") throw new CrudValidationError("Logotipo inválido.");
  const match = /^data:image\/(?:png|jpeg|gif|webp|bmp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw new CrudValidationError("Formato de logotipo inválido.");
  const bytes = Buffer.from(match[1], "base64");
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new CrudValidationError("O logotipo deve ter até 2 MB.");
  return bytes;
}

export function serializeCrudRecord(record: Record<string, unknown>, model: string) {
  if (model !== "Banco" || !record.Logo) return record;
  const bytes = Buffer.from(record.Logo as Uint8Array);
  return { ...record, Logo: bytes.toString("base64") };
}

export function validateBankNumber(value: unknown): string {
  const number = String(value);
  if (!/^\d{1,11}$/.test(number)) throw new CrudValidationError("Nosso número (11) deve conter até 11 dígitos.");
  return number;
}
