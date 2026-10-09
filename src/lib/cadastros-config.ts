export interface CadastroField {
  name: string;
  label: string;
  kind?: "checkbox" | "date" | "number" | "image";
  maxLength?: number;
}

export interface CadastroConfig {
  label: string;
  id: string;
  fields: CadastroField[];
  columns: { name: string; label: string }[];
  searchFields: { name: string; label: string }[];
}

export const cadastrosConfig: Record<string, CadastroConfig> = {
  Forma: {
    label: "Forma de Pagamento", id: "CodForma",
    fields: [
      { name: "Forma", label: "Forma de pagamento", maxLength: 30 },
      { name: "CodFormaECF", label: "Código PAF", maxLength: 3 },
      { name: "VendaAVista", label: "Pagamento à vista", kind: "checkbox" },
      { name: "Cartao", label: "Cartão/Pré-datado/Crediário", kind: "checkbox" },
      { name: "Cobranca", label: "Boleto (interoperabilidade)", kind: "checkbox" },
      { name: "NCaixa", label: "Omite fechamento (pendência)", kind: "checkbox" },
      { name: "CodFor", label: "Fornecedor", kind: "number" },
    ],
    columns: [{ name: "CodForma", label: "Código" }, { name: "Forma", label: "Forma de Pagamento" }],
    searchFields: [{ name: "CodForma", label: "Código" }, { name: "Forma", label: "Forma" }],
  },
  Tipo: {
    label: "Tipo Contábil", id: "CodTipo",
    fields: [
      { name: "Data", label: "Data", kind: "date" },
      { name: "Cod_Cta", label: "COD_CTA (SPED)", maxLength: 15 },
      { name: "Tipo", label: "Tipo de lançamento", maxLength: 30 },
      { name: "Lancamento", label: "Conta lançamento", kind: "checkbox" },
      { name: "Totalizador", label: "Conta totalizadora", kind: "checkbox" },
      { name: "Classificacao", label: "Chave contábil", maxLength: 20 },
      { name: "Historico", label: "Histórico complementar", maxLength: 30 },
    ],
    columns: [{ name: "CodTipo", label: "Código" }, { name: "Lancamento", label: "L" }, { name: "Perfil", label: "P" }, { name: "Classificacao", label: "Chave Contábil" }, { name: "Tipo", label: "Tipo" }],
    searchFields: [{ name: "CodTipo", label: "Código" }, { name: "Classificacao", label: "Classificação" }, { name: "Tipo", label: "Tipo" }],
  },
  Banco: {
    label: "Banco", id: "CodBan",
    fields: [
      { name: "Inativo", label: "Inativo", kind: "checkbox" },
      { name: "Banco", label: "Banco", maxLength: 20 },
      { name: "Grupo", label: "Grupo", maxLength: 5 },
      { name: "Logo", label: "Logotipo", kind: "image" },
      { name: "NumeroBanco", label: "Número", maxLength: 5 },
      { name: "Agencia", label: "Agência", maxLength: 6 },
      { name: "Conta", label: "Conta", maxLength: 15 },
      { name: "Convenio", label: "Convênio", maxLength: 6 },
      { name: "NossoNumero", label: "Nosso número (11)", maxLength: 11 },
      { name: "NossoNumero2", label: "Nosso número (17)", maxLength: 17 },
    ],
    columns: [{ name: "CodBan", label: "Código" }, { name: "Grupo", label: "Grp." }, { name: "Banco", label: "Banco" }],
    searchFields: [{ name: "CodBan", label: "Código" }, { name: "Banco", label: "Banco" }],
  },
  Ref_Ban: {
    label: "Referência", id: "CodRef",
    fields: [{ name: "Referencia", label: "Referência bancária", maxLength: 20 }, { name: "Descricao", label: "Descrição", maxLength: 30 }],
    columns: [{ name: "CodRef", label: "Código" }, { name: "Referencia", label: "Referência Bancária" }],
    searchFields: [{ name: "CodRef", label: "Código" }, { name: "Referencia", label: "Referência" }],
  },
  CentroCusto: {
    label: "Centro Resultado", id: "CodCen",
    fields: [{ name: "Inativo", label: "Inativo", kind: "checkbox" }, { name: "Centro", label: "Centro de resultado", maxLength: 50 }],
    columns: [{ name: "CodCen", label: "Código" }, { name: "Classificacao", label: "Class." }, { name: "Centro", label: "Centro de resultado" }],
    searchFields: [{ name: "CodCen", label: "Código" }, { name: "Classificacao", label: "Classificação" }, { name: "Centro", label: "Centro de resultado" }],
  },
};

export function buildCadastroSearch(model: string, search: string, searchField: string) {
  const config = cadastrosConfig[model];
  if (!config || !search.trim()) return {};
  const fields = config.searchFields.filter(field => !searchField || field.name === searchField);
  const value = search.trim();
  return { OR: fields.flatMap<Record<string, number | { contains: string }>>(field => field.name === config.id
    ? (/^\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? [{ [field.name]: Number(value) }] : [])
    : [{ [field.name]: { contains: value } }]) };
}
