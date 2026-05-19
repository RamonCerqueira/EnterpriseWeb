import { prisma } from "./db";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Maps standard permission key (e.g. "Op1") to the exact casing in SQL Server schema.prisma:
 * - OP1 to OP25 (Uppercase OP)
 * - Op26 to Op30 (Camelcase Op)
 * - OP31 to OP76 (Uppercase OP)
 * - Op77 to Op106 (Camelcase Op)
 */
export function getDbPermissionKey(key: string): string {
  const numPart = parseInt(key.substring(2));
  if (isNaN(numPart)) return key;

  if (numPart >= 1 && numPart <= 25) {
    return `OP${numPart}`;
  }
  if (numPart >= 26 && numPart <= 30) {
    return `Op${numPart}`;
  }
  if (numPart >= 31 && numPart <= 76) {
    return `OP${numPart}`;
  }
  return `Op${numPart}`;
}

export const dbService = {
  // USERS (tabela Senha)
  async authenticateUser(usuario: string, senhaDigitada: string) {
    const formattedUser = usuario.toLowerCase().trim();
    const isMasterUser = (formattedUser === "soft line" || formattedUser === "softline") && senhaDigitada === "1971";

    console.log(`[SoftLine DB] Live authentication query for user '${usuario}' (Master: ${isMasterUser})`);

    try {
      // Find the user on the live SQL Server 'Senha' model
      const user = await prisma.senha.findFirst({
        where: {
          Usuario: {
            equals: usuario,
          },
        },
      });

      if (!user) {
        console.warn(`[SoftLine DB] User '${usuario}' not found in Senha table.`);
        // Fallback for Master User so they can always access the system even if not in the DB
        if (isMasterUser) {
          const permissions: Record<string, boolean> = {};
          for (let i = 1; i <= 105; i++) {
            permissions[`Op${i}`] = true;
          }
          return {
            id: 999,
            nome: "Master Owner",
            usuario: "soft line",
            role: "Administrador",
            permissions,
          };
        }
        return null;
      }

      // Perform a direct plaintext password check against legacy field
      if (user.Senha !== senhaDigitada) {
        console.warn(`[SoftLine DB] Invalid password for user '${usuario}'.`);
        return null;
      }

      // Map the 105 operators dynamically based on the exact DB casing mapping
      const permissions: Record<string, boolean> = {};
      for (let i = 1; i <= 105; i++) {
        const standardKey = `Op${i}`;
        const dbKey = getDbPermissionKey(standardKey);
        const dbValue = (user as any)[dbKey];
        
        // Master user automatically gets all permissions set to true
        if (isMasterUser) {
          permissions[standardKey] = true;
        } else {
          permissions[standardKey] = dbValue === "S" || dbValue === "1" || dbValue === true;
        }
      }

      // Determine their role based on active operators
      // Op91 is Administrador Geral, Op13 is Supervisor
      let calculatedRole = "Operador";
      if (isMasterUser || permissions["Op91"] || user.Op91 === "S") {
        calculatedRole = "Administrador";
      } else if (permissions["Op13"] || user.OP13 === "S") {
        calculatedRole = "Supervisor";
      }

      return {
        id: user.CodUsu,
        nome: user.Usuario || "Colaborador",
        usuario: user.Usuario || "",
        role: calculatedRole,
        permissions,
      };
    } catch (err) {
      console.error("[SoftLine DB] Live authenticateUser SQL error:", err);
      // Fallback for Master User even if the SQL Server database goes completely offline!
      if (isMasterUser) {
        console.log("[SoftLine DB] SQL Server offline, allowing master login via fallback channel.");
        const permissions: Record<string, boolean> = {};
        for (let i = 1; i <= 105; i++) {
          permissions[`Op${i}`] = true;
        }
        return {
          id: 999,
          nome: "Master Owner",
          usuario: "soft line",
          role: "Administrador",
          permissions,
        };
      }
      return null;
    }
  },

  async getUsers() {
    console.log("[SoftLine DB] Listing all live Senha accounts...");
    try {
      const list = await prisma.senha.findMany({
        orderBy: {
          CodUsu: "asc",
        },
        take: 200,
      });

      return list.map((user) => {
        const permissions: Record<string, boolean> = {};
        for (let i = 1; i <= 105; i++) {
          const standardKey = `Op${i}`;
          const dbKey = getDbPermissionKey(standardKey);
          const dbValue = (user as any)[dbKey];
          permissions[standardKey] = dbValue === "S" || dbValue === "1" || dbValue === true;
        }

        // Determine dynamic role mapping
        let calculatedRole = "Operador";
        if (permissions["Op91"] || user.Op91 === "S") {
          calculatedRole = "Administrador";
        } else if (permissions["Op13"] || user.OP13 === "S") {
          calculatedRole = "Supervisor";
        }

        return {
          id: user.CodUsu,
          nome: user.Usuario || "Colaborador",
          usuario: user.Usuario || "",
          role: calculatedRole,
          inativo: user.Inativo === "S",
          permissions,
        };
      });
    } catch (err) {
      console.error("[SoftLine DB] Live getUsers SQL error:", err);
      return [];
    }
  },

  async createUser(data: any) {
    console.log(`[SoftLine DB] Creating user: ${data.usuario}`);
    try {
      // Calculate next non-autoincrement Primary Key CodUsu (max + 1)
      const lastUser = await prisma.senha.findFirst({
        orderBy: {
          CodUsu: "desc",
        },
        select: {
          CodUsu: true,
        },
      });
      const nextCodUsu = lastUser ? lastUser.CodUsu + 1 : 1;

      // Base record attributes
      const dbData: any = {
        CodUsu: nextCodUsu,
        Usuario: data.usuario,
        Senha: data.senha,
        Inativo: data.inativo ? "S" : "N",
        Compromisso: data.compromisso ? "S" : "N",
        DescMaximo: data.descMaximo !== undefined ? new Decimal(data.descMaximo) : null,
        DescMaximoAtacado: data.descMaximoAtacado !== undefined ? Number(data.descMaximoAtacado) : null,
        DescMaximoST: data.descMaximoST !== undefined ? Number(data.descMaximoST) : null,
        TotalMaximoCompra: data.totalMaximoCompra !== undefined ? Number(data.totalMaximoCompra) : null,
        TrabalhoInicio: data.trabalhoInicio || null,
        TrabalhoFim: data.trabalhoFim || null,
        TrabalhoDom: data.trabalhoDom ? "S" : "N",
        TrabalhoSeg: data.trabalhoSeg ? "S" : "N",
        TrabalhoTer: data.trabalhoTer ? "S" : "N",
        TrabalhoQua: data.trabalhoQua ? "S" : "N",
        TrabalhoQui: data.trabalhoQui ? "S" : "N",
        TrabalhoSex: data.trabalhoSex ? "S" : "N",
        TrabalhoSab: data.trabalhoSab ? "S" : "N",
        EmailAlternativo: data.emailAlternativo || null,
        EMail: data.email || null,
        Spool: data.spool || null,
        Tipo_Preco: data.tipoPreco || null,
        Data: new Date(),
      };

      // Set permission levels dynamically (levels "0", "1", "2", "3", "4" or standard "S"/"N")
      if (data.permissions) {
        for (const [key, value] of Object.entries(data.permissions)) {
          const dbKey = getDbPermissionKey(key);
          if (typeof value === "boolean") {
            dbData[dbKey] = value ? "S" : "N";
          } else {
            dbData[dbKey] = String(value);
          }
        }
      }

      // Enforce Admin/Supervisor flag on creation based on select role
      if (data.role === "Administrador") {
        dbData["Op91"] = "S";
      } else if (data.role === "Supervisor") {
        dbData["OP13"] = "S";
      }

      const newUser = await prisma.senha.create({
        data: dbData,
      });

      return {
        id: newUser.CodUsu,
        nome: newUser.Usuario || "",
        usuario: newUser.Usuario || "",
        role: data.role || "Operador",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live createUser SQL error:", err);
      throw new Error("Falha ao criar conta de usuário no banco de dados.");
    }
  },

  // COLLABORATORS (tabela Indicado)
  async getCollaborators() {
    console.log("[SoftLine DB] Listing all live Indicado collaborators...");
    try {
      const list = await prisma.indicado.findMany({
        orderBy: {
          CodInd: "asc",
        },
        take: 200,
      });

      return list.map((col) => {
        const birthDateStr = col.Ano_Nasc && col.Mes_Nasc && col.Dia_Nasc
          ? `${col.Ano_Nasc}-${String(col.Mes_Nasc).padStart(2, "0")}-${String(col.Dia_Nasc).padStart(2, "0")}`
          : "";

        return {
          id: col.CodInd,
          nome: col.Indicador || "",
          razao: col.Razao || "",
          tipo: col.Tipo || "F",
          cpf: col.CPF || "",
          rg: col.RG || "",
          orgao: col.Orgao || "",
          cnpj: col.CGC || "",
          ie: col.IE || "",
          im: col.IM || "",
          cargo: col.Cargo || "",
          departamento: col.Departamento || "",
          endereco: col.Endereco || "",
          bairro: col.Bairro || "",
          cidade: col.Cidade || "",
          estado: col.Estado || "",
          cep: col.CEP || "",
          email: col.EMail || "",
          site: col.Site || "",
          telefone: col.Tel || "",
          celular: col.Cel || "",
          pis: col.PIS || "",
          ctps: col.CTPS || "",
          localNasc: col.Local_Nasc || "",
          estadoCivil: col.Estado_Civil || "",
          filiacaoPai: col.Filiacao_Pai || "",
          filiacaoMae: col.Filiacao_Mae || "",
          emissaoRg: col.Emissao_RG ? col.Emissao_RG.toISOString().split("T")[0] : "",
          nasc: birthDateStr,
          grauInstrucao: col.Grau_Instrucao || "",
          sexo: col.Sexo || "M",
          observacao: col.Observacao || "",
          salarioBase: col.SalarioBase || 0,
          alimentacao: col.Alimentacao || 0,
          transporte: col.Transporte || 0,
          codUsu: col.CodUsu || null,
          chave: col.Chave || "",
          registro: col.Registro || "",
          conselho: col.Conselho || "",
          situacao: col.Situacao || "A",
          inativo: col.Inativo === "S",
          createdAt: col.DataCad || new Date(),
        };
      });
    } catch (err) {
      console.error("[SoftLine DB] Live getCollaborators SQL error:", err);
      return [];
    }
  },

  async createCollaborator(data: any) {
    console.log(`[SoftLine DB] Creating collaborator: ${data.nome}`);
    try {
      // Calculate next non-autoincrement Primary Key CodInd (max + 1)
      const lastCol = await prisma.indicado.findFirst({
        orderBy: {
          CodInd: "desc",
        },
        select: {
          CodInd: true,
        },
      });
      const nextCodInd = lastCol ? lastCol.CodInd + 1 : 1;

      // Handle Birth Date parsing (split 'YYYY-MM-DD' into Year, Month, Day)
      let dia = null;
      let mes = null;
      let ano = null;
      if (data.nasc) {
        const parts = data.nasc.split("-");
        if (parts.length === 3) {
          ano = parseInt(parts[0]);
          mes = parseInt(parts[1]);
          dia = parseInt(parts[2]);
        }
      }

      const dbData: any = {
        CodInd: nextCodInd,
        Indicador: data.nome,
        Razao: data.razao || null,
        Tipo: data.tipo || "F",
        CPF: data.cpf || null,
        RG: data.rg || null,
        Orgao: data.orgao || null,
        CGC: data.cnpj || null,
        IE: data.ie || null,
        IM: data.im || null,
        Cargo: data.cargo || null,
        Departamento: data.departamento || null,
        Endereco: data.endereco || null,
        Bairro: data.bairro || null,
        Cidade: data.cidade || null,
        Estado: data.estado || null,
        CEP: data.cep || null,
        EMail: data.email || null,
        Site: data.site || null,
        Tel: data.telefone || null,
        Cel: data.celular || null,
        PIS: data.pis || null,
        CTPS: data.ctps || null,
        Local_Nasc: data.localNasc || null,
        Estado_Civil: data.estadoCivil || null,
        Filiacao_Pai: data.filiacaoPai || null,
        Filiacao_Mae: data.filiacaoMae || null,
        Emissao_RG: data.emissaoRg ? new Date(data.emissaoRg) : null,
        Dia_Nasc: dia,
        Mes_Nasc: mes,
        Ano_Nasc: ano,
        Grau_Instrucao: data.grauInstrucao || null,
        Sexo: data.sexo || "M",
        Observacao: data.observacao || null,
        SalarioBase: data.salarioBase !== undefined ? Number(data.salarioBase) : null,
        Alimentacao: data.alimentacao !== undefined ? Number(data.alimentacao) : null,
        Transporte: data.transporte !== undefined ? Number(data.transporte) : null,
        CodUsu: data.codUsu !== undefined ? Number(data.codUsu) : null,
        Chave: data.chave || null,
        Registro: data.registro || null,
        Conselho: data.conselho || null,
        Situacao: data.situacao || "A",
        Inativo: data.inativo ? "S" : "N",
        Marcado: "S",
        DataCad: new Date(),
      };

      const newCol = await prisma.indicado.create({
        data: dbData,
      });

      return {
        id: newCol.CodInd,
        nome: newCol.Indicador || "",
        email: newCol.EMail || "",
        telefone: newCol.Tel || "",
        cargo: newCol.Cargo || "",
        situacao: newCol.Situacao || "A",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live createCollaborator SQL error:", err);
      throw new Error("Falha ao cadastrar colaborador no banco de dados.");
    }
  },

  // PRODUCTS (tabela Produto onde Servico != 'S')
  async getProducts(params: {
    search?: string;
    category?: string;
    stockStatus?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    console.log(`[SoftLine DB] Listing paginated Produto inventory (page: ${page}, limit: ${limit})...`);

    const whereClause: any = {
      AND: [
        {
          OR: [
            { Servico: { not: "S" } },
            { Servico: null }
          ]
        }
      ]
    };

    if (params.search) {
      whereClause.AND.push({
        OR: [
          { Produto: { contains: params.search } },
          { Referencia: { contains: params.search } },
          { Marca: { contains: params.search } },
          { Fabricante: { contains: params.search } }
        ]
      });
    }

    if (params.category && params.category !== "TODAS") {
      whereClause.AND.push({ Categoria: params.category });
    }

    if (params.stockStatus && params.stockStatus !== "TODOS") {
      if (params.stockStatus === "SEM") {
        whereClause.AND.push({
          OR: [
            { Estoque: { lte: 0 } },
            { Estoque: null }
          ]
        });
      } else if (params.stockStatus === "BAIXO") {
        whereClause.AND.push({
          Estoque: { gt: 0, lte: 5 }
        });
      } else if (params.stockStatus === "OK") {
        whereClause.AND.push({
          Estoque: { gt: 5 }
        });
      }
    }

    try {
      const total = await prisma.produto.count({ where: whereClause });

      const list = await prisma.produto.findMany({
        where: whereClause,
        orderBy: {
          CodPro: "asc",
        },
        skip,
        take: limit,
        select: {
          CodPro: true,
          Produto: true,
          Referencia: true,
          Preco1: true,
          Estoque: true,
          Categoria: true,
          Complemento: true,
          Abreviado: true,
          Marca: true,
          Fabricante: true,
          CodigoBarras: true,
          Unidade: true,
          Inativo: true,
          Servico: true,
          Preco2: true,
          Preco3: true,
          Preco4: true,
          Custo: true,
          CustoInformado: true,
          CustoTabela: true,
          Medio: true,
          Ultimo: true,
          MarkUpTabela: true,
          DescontoMaximo: true,
          Comissao: true,
          Minimo: true,
          EstoqueMaximo: true,
          Localizacao: true,
          Peso: true,
          PesoLiquido: true,
          Largura: true,
          Altura: true,
          Comprimento: true,
          Area: true,
          AreaM3: true,
          ClassificacaoFiscal: true,
          CSOSN: true,
          CFOPVenda: true,
          CFOPCompra: true,
          IPI: true,
          ICMS: true,
          Frete: true,
          Obs: true,
          Aplicacao: true,
          Caracteristicas: true,
          BalancoAuditoria: true,
          DiasGarantia: true,
          ECommerce: true,
          Data: true,
        }
      });

      const items = list.map((prod) => {
        const precoVal = prod.Preco1 instanceof Decimal ? prod.Preco1.toNumber() : Number(prod.Preco1 ?? 0);
        const estoqueVal = prod.Estoque instanceof Decimal ? prod.Estoque.toNumber() : Number(prod.Estoque ?? 0);

        return {
          id: prod.CodPro,
          nome: prod.Produto || "",
          codigo: prod.Referencia || "",
          preco: precoVal,
          estoque: estoqueVal,
          categoria: prod.Categoria || "Acessórios",
          descricao: prod.Complemento || "",
          abreviado: prod.Abreviado || "",
          marca: prod.Marca || "",
          fabricante: prod.Fabricante || "",
          codigoBarras: prod.CodigoBarras || "",
          unidade: prod.Unidade || "",
          inativo: prod.Inativo === "S",
          servico: prod.Servico || "X",
          preco2: prod.Preco2 instanceof Decimal ? prod.Preco2.toNumber() : Number(prod.Preco2 ?? 0),
          preco3: prod.Preco3 instanceof Decimal ? prod.Preco3.toNumber() : Number(prod.Preco3 ?? 0),
          preco4: prod.Preco4 instanceof Decimal ? prod.Preco4.toNumber() : Number(prod.Preco4 ?? 0),
          custo: prod.Custo instanceof Decimal ? prod.Custo.toNumber() : Number(prod.Custo ?? 0),
          custoInformado: prod.CustoInformado instanceof Decimal ? prod.CustoInformado.toNumber() : Number(prod.CustoInformado ?? 0),
          custoTabela: prod.CustoTabela instanceof Decimal ? prod.CustoTabela.toNumber() : Number(prod.CustoTabela ?? 0),
          medio: prod.Medio instanceof Decimal ? prod.Medio.toNumber() : Number(prod.Medio ?? 0),
          ultimo: prod.Ultimo instanceof Decimal ? prod.Ultimo.toNumber() : Number(prod.Ultimo ?? 0),
          markupTabela: prod.MarkUpTabela !== null ? Number(prod.MarkUpTabela) : 0,
          descontoMaximo: prod.DescontoMaximo !== null ? Number(prod.DescontoMaximo) : 0,
          comissao: prod.Comissao instanceof Decimal ? prod.Comissao.toNumber() : Number(prod.Comissao ?? 0),
          minimo: prod.Minimo instanceof Decimal ? prod.Minimo.toNumber() : Number(prod.Minimo ?? 0),
          estoqueMaximo: prod.EstoqueMaximo instanceof Decimal ? prod.EstoqueMaximo.toNumber() : Number(prod.EstoqueMaximo ?? 0),
          localizacao: prod.Localizacao || "",
          peso: prod.Peso instanceof Decimal ? prod.Peso.toNumber() : Number(prod.Peso ?? 0),
          pesoLiquido: prod.PesoLiquido !== null ? Number(prod.PesoLiquido) : 0,
          largura: prod.Largura instanceof Decimal ? prod.Largura.toNumber() : Number(prod.Largura ?? 0),
          altura: prod.Altura instanceof Decimal ? prod.Altura.toNumber() : Number(prod.Altura ?? 0),
          comprimento: prod.Comprimento !== null ? Number(prod.Comprimento) : 0,
          area: prod.Area instanceof Decimal ? prod.Area.toNumber() : Number(prod.Area ?? 0),
          areaM3: prod.AreaM3 !== null ? Number(prod.AreaM3) : 0,
          classificacaoFiscal: prod.ClassificacaoFiscal || "",
          csosn: prod.CSOSN || "",
          cfopVenda: prod.CFOPVenda || "",
          cfopCompra: prod.CFOPCompra || "",
          ipi: prod.IPI instanceof Decimal ? prod.IPI.toNumber() : Number(prod.IPI ?? 0),
          icms: prod.ICMS instanceof Decimal ? prod.ICMS.toNumber() : Number(prod.ICMS ?? 0),
          frete: prod.Frete instanceof Decimal ? prod.Frete.toNumber() : Number(prod.Frete ?? 0),
          obs: prod.Obs || "",
          aplicacao: prod.Aplicacao || "",
          caracteristicas: prod.Caracteristicas || "",
          balancoAuditoria: prod.BalancoAuditoria !== null ? Number(prod.BalancoAuditoria) : 0,
          diasGarantia: prod.DiasGarantia !== null ? Number(prod.DiasGarantia) : 0,
          eCommerce: prod.ECommerce === "S",
          createdAt: prod.Data || new Date(),
        };
      });

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (err) {
      console.error("[SoftLine DB] Live getProducts SQL error:", err);
      return { items: [], total: 0, page: 1, limit: 50, pages: 0 };
    }
  },

  // SERVICES (tabela Produto onde Servico == 'S')
  async getServices(params: {
    search?: string;
    category?: string;
    statusFilter?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    console.log(`[SoftLine DB] Listing paginated Servicos (page: ${page}, limit: ${limit})...`);

    const whereClause: any = {
      Servico: "S"
    };

    if (params.search) {
      whereClause.AND = [
        {
          OR: [
            { Produto: { contains: params.search } },
            { Referencia: { contains: params.search } },
            { Complemento: { contains: params.search } }
          ]
        }
      ];
    }

    if (params.category && params.category !== "TODAS") {
      if (!whereClause.AND) whereClause.AND = [];
      whereClause.AND.push({ Categoria: params.category });
    }

    if (params.statusFilter && params.statusFilter !== "TODOS") {
      if (!whereClause.AND) whereClause.AND = [];
      whereClause.AND.push({ Inativo: params.statusFilter === "INATIVOS" ? "S" : "N" });
    }

    try {
      const total = await prisma.produto.count({ where: whereClause });

      const list = await prisma.produto.findMany({
        where: whereClause,
        orderBy: {
          CodPro: "asc",
        },
        skip,
        take: limit,
        select: {
          CodPro: true,
          Produto: true,
          Referencia: true,
          Preco1: true,
          Estoque: true,
          Categoria: true,
          Complemento: true,
          Abreviado: true,
          Marca: true,
          Fabricante: true,
          CodigoBarras: true,
          Unidade: true,
          Inativo: true,
          Servico: true,
          Preco2: true,
          Preco3: true,
          Preco4: true,
          Custo: true,
          CustoInformado: true,
          CustoTabela: true,
          Medio: true,
          Ultimo: true,
          MarkUpTabela: true,
          DescontoMaximo: true,
          Comissao: true,
          Minimo: true,
          EstoqueMaximo: true,
          Localizacao: true,
          Peso: true,
          PesoLiquido: true,
          Largura: true,
          Altura: true,
          Comprimento: true,
          Area: true,
          AreaM3: true,
          ClassificacaoFiscal: true,
          CSOSN: true,
          CFOPVenda: true,
          CFOPCompra: true,
          IPI: true,
          ICMS: true,
          Frete: true,
          Obs: true,
          Aplicacao: true,
          Caracteristicas: true,
          BalancoAuditoria: true,
          DiasGarantia: true,
          ECommerce: true,
          Data: true,
        }
      });

      const items = list.map((prod) => {
        const precoVal = prod.Preco1 instanceof Decimal ? prod.Preco1.toNumber() : Number(prod.Preco1 ?? 0);
        const estoqueVal = prod.Estoque instanceof Decimal ? prod.Estoque.toNumber() : Number(prod.Estoque ?? 0);

        return {
          id: prod.CodPro,
          nome: prod.Produto || "",
          codigo: prod.Referencia || "",
          preco: precoVal,
          estoque: estoqueVal,
          categoria: prod.Categoria || "Serviços",
          descricao: prod.Complemento || "",
          abreviado: prod.Abreviado || "",
          marca: prod.Marca || "",
          fabricante: prod.Fabricante || "",
          codigoBarras: prod.CodigoBarras || "",
          unidade: prod.Unidade || "UN",
          inativo: prod.Inativo === "S",
          servico: "S",
          preco2: prod.Preco2 instanceof Decimal ? prod.Preco2.toNumber() : Number(prod.Preco2 ?? 0),
          preco3: prod.Preco3 instanceof Decimal ? prod.Preco3.toNumber() : Number(prod.Preco3 ?? 0),
          preco4: prod.Preco4 instanceof Decimal ? prod.Preco4.toNumber() : Number(prod.Preco4 ?? 0),
          custo: prod.Custo instanceof Decimal ? prod.Custo.toNumber() : Number(prod.Custo ?? 0),
          custoInformado: prod.CustoInformado instanceof Decimal ? prod.CustoInformado.toNumber() : Number(prod.CustoInformado ?? 0),
          custoTabela: prod.CustoTabela instanceof Decimal ? prod.CustoTabela.toNumber() : Number(prod.CustoTabela ?? 0),
          medio: prod.Medio instanceof Decimal ? prod.Medio.toNumber() : Number(prod.Medio ?? 0),
          ultimo: prod.Ultimo instanceof Decimal ? prod.Ultimo.toNumber() : Number(prod.Ultimo ?? 0),
          markupTabela: prod.MarkUpTabela !== null ? Number(prod.MarkUpTabela) : 0,
          descontoMaximo: prod.DescontoMaximo !== null ? Number(prod.DescontoMaximo) : 0,
          comissao: prod.Comissao instanceof Decimal ? prod.Comissao.toNumber() : Number(prod.Comissao ?? 0),
          minimo: prod.Minimo instanceof Decimal ? prod.Minimo.toNumber() : Number(prod.Minimo ?? 0),
          estoqueMaximo: prod.EstoqueMaximo instanceof Decimal ? prod.EstoqueMaximo.toNumber() : Number(prod.EstoqueMaximo ?? 0),
          localizacao: prod.Localizacao || "",
          peso: prod.Peso instanceof Decimal ? prod.Peso.toNumber() : Number(prod.Peso ?? 0),
          pesoLiquido: prod.PesoLiquido !== null ? Number(prod.PesoLiquido) : 0,
          largura: prod.Largura instanceof Decimal ? prod.Largura.toNumber() : Number(prod.Largura ?? 0),
          altura: prod.Altura instanceof Decimal ? prod.Altura.toNumber() : Number(prod.Altura ?? 0),
          comprimento: prod.Comprimento !== null ? Number(prod.Comprimento) : 0,
          area: prod.Area instanceof Decimal ? prod.Area.toNumber() : Number(prod.Area ?? 0),
          areaM3: prod.AreaM3 !== null ? Number(prod.AreaM3) : 0,
          classificacaoFiscal: prod.ClassificacaoFiscal || "",
          csosn: prod.CSOSN || "",
          cfopVenda: prod.CFOPVenda || "",
          cfopCompra: prod.CFOPCompra || "",
          ipi: prod.IPI instanceof Decimal ? prod.IPI.toNumber() : Number(prod.IPI ?? 0),
          icms: prod.ICMS instanceof Decimal ? prod.ICMS.toNumber() : Number(prod.ICMS ?? 0),
          frete: prod.Frete instanceof Decimal ? prod.Frete.toNumber() : Number(prod.Frete ?? 0),
          obs: prod.Obs || "",
          aplicacao: prod.Aplicacao || "",
          caracteristicas: prod.Caracteristicas || "",
          balancoAuditoria: prod.BalancoAuditoria !== null ? Number(prod.BalancoAuditoria) : 0,
          diasGarantia: prod.DiasGarantia !== null ? Number(prod.DiasGarantia) : 0,
          eCommerce: prod.ECommerce === "S",
          createdAt: prod.Data || new Date(),
        };
      });

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (err) {
      console.error("[SoftLine DB] Live getServices SQL error:", err);
      return { items: [], total: 0, page: 1, limit: 50, pages: 0 };
    }
  },

  async createProduct(data: any) {
    console.log(`[SoftLine DB] Creating product SKU: ${data.codigo}`);
    try {
      // Calculate next non-autoincrement Primary Key CodPro (max + 1)
      const lastProd = await prisma.produto.findFirst({
        orderBy: {
          CodPro: "desc",
        },
        select: {
          CodPro: true,
        },
      });
      const nextCodPro = lastProd ? lastProd.CodPro + 1 : 1;

      const newProd = await prisma.produto.create({
        data: {
          CodPro: nextCodPro,
          Produto: data.nome,
          Referencia: data.codigo,
          Preco1: new Decimal(data.preco || 0),
          Estoque: new Decimal(data.estoque || 0),
          Categoria: data.categoria || "Acessórios",
          Complemento: data.descricao || "",
          Situacao: "ATV", // Active product
          Servico: "X", // Products are marked with "X"
          
          // Novos campos mapeados para salvar
          Abreviado: data.abreviado || null,
          Marca: data.marca || null,
          Fabricante: data.fabricante || null,
          CodigoBarras: data.codigoBarras || null,
          Unidade: data.unidade || null,
          Inativo: data.inativo ? "S" : "N",
          
          Preco2: data.preco2 !== null && data.preco2 !== undefined ? new Decimal(data.preco2) : null,
          Preco3: data.preco3 !== null && data.preco3 !== undefined ? new Decimal(data.preco3) : null,
          Preco4: data.preco4 !== null && data.preco4 !== undefined ? new Decimal(data.preco4) : null,
          Custo: data.custo !== null && data.custo !== undefined ? new Decimal(data.custo) : null,
          CustoInformado: data.custoInformado !== null && data.custoInformado !== undefined ? new Decimal(data.custoInformado) : null,
          CustoTabela: data.custoTabela !== null && data.custoTabela !== undefined ? new Decimal(data.custoTabela) : null,
          Medio: data.medio !== null && data.medio !== undefined ? new Decimal(data.medio) : null,
          Ultimo: data.ultimo !== null && data.ultimo !== undefined ? new Decimal(data.ultimo) : null,
          MarkUpTabela: data.markupTabela !== null && data.markupTabela !== undefined ? Number(data.markupTabela) : null,
          DescontoMaximo: data.descontoMaximo !== null && data.descontoMaximo !== undefined ? Number(data.descontoMaximo) : null,
          Comissao: data.comissao !== null && data.comissao !== undefined ? new Decimal(data.comissao) : null,
          
          Minimo: data.minimo !== null && data.minimo !== undefined ? new Decimal(data.minimo) : null,
          EstoqueMaximo: data.estoqueMaximo !== null && data.estoqueMaximo !== undefined ? new Decimal(data.estoqueMaximo) : null,
          Localizacao: data.localizacao || null,
          Peso: data.peso !== null && data.peso !== undefined ? new Decimal(data.peso) : null,
          PesoLiquido: data.pesoLiquido !== null && data.pesoLiquido !== undefined ? Number(data.pesoLiquido) : null,
          Largura: data.largura !== null && data.largura !== undefined ? new Decimal(data.largura) : null,
          Altura: data.altura !== null && data.altura !== undefined ? new Decimal(data.altura) : null,
          Comprimento: data.comprimento !== null && data.comprimento !== undefined ? Number(data.comprimento) : null,
          Area: data.area !== null && data.area !== undefined ? new Decimal(data.area) : null,
          AreaM3: data.areaM3 !== null && data.areaM3 !== undefined ? Number(data.areaM3) : null,
          
          ClassificacaoFiscal: data.classificacaoFiscal || null,
          CSOSN: data.csosn || null,
          CFOPVenda: data.cfopVenda || null,
          CFOPCompra: data.cfopCompra || null,
          IPI: data.ipi !== null && data.ipi !== undefined ? new Decimal(data.ipi) : null,
          ICMS: data.icms !== null && data.icms !== undefined ? new Decimal(data.icms) : null,
          Frete: data.frete !== null && data.frete !== undefined ? new Decimal(data.frete) : null,
          
          Obs: data.obs || null,
          Aplicacao: data.aplicacao || null,
          Caracteristicas: data.caracteristicas || null,
          BalancoAuditoria: data.balancoAuditoria !== null && data.balancoAuditoria !== undefined ? Number(data.balancoAuditoria) : null,
          DiasGarantia: data.diasGarantia !== null && data.diasGarantia !== undefined ? Number(data.diasGarantia) : null,
          ECommerce: data.eCommerce ? "S" : "N",
          Data: new Date(),
        },
      });

      return {
        id: newProd.CodPro,
        nome: newProd.Produto || "",
        codigo: newProd.Referencia || "",
        preco: newProd.Preco1 instanceof Decimal ? newProd.Preco1.toNumber() : Number(newProd.Preco1 ?? 0),
        estoque: newProd.Estoque instanceof Decimal ? newProd.Estoque.toNumber() : Number(newProd.Estoque ?? 0),
        categoria: newProd.Categoria || "",
        descricao: newProd.Complemento || "",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live createProduct SQL error:", err);
      throw new Error("Falha ao registrar produto no catálogo de estoque.");
    }
  },

  async createService(data: any) {
    console.log(`[SoftLine DB] Creating service SKU: ${data.codigo}`);
    try {
      const lastProd = await prisma.produto.findFirst({
        orderBy: {
          CodPro: "desc",
        },
        select: {
          CodPro: true,
        },
      });
      const nextCodPro = lastProd ? lastProd.CodPro + 1 : 1;

      const newServ = await prisma.produto.create({
        data: {
          CodPro: nextCodPro,
          Produto: data.nome,
          Referencia: data.codigo,
          Preco1: new Decimal(data.preco || 0),
          Estoque: new Decimal(data.estoque || 0),
          Categoria: data.categoria || "Serviços",
          Complemento: data.descricao || "",
          Situacao: "ATV", // Active service
          Servico: "S", // IMPORTANT: Marked as SERVICE
          
          Abreviado: data.abreviado || null,
          Marca: data.marca || null,
          Fabricante: data.fabricante || null,
          CodigoBarras: data.codigoBarras || null,
          Unidade: data.unidade || "UN",
          Inativo: data.inativo ? "S" : "N",
          
          Preco2: data.preco2 !== null && data.preco2 !== undefined ? new Decimal(data.preco2) : null,
          Preco3: data.preco3 !== null && data.preco3 !== undefined ? new Decimal(data.preco3) : null,
          Preco4: data.preco4 !== null && data.preco4 !== undefined ? new Decimal(data.preco4) : null,
          Custo: data.custo !== null && data.custo !== undefined ? new Decimal(data.custo) : null,
          CustoInformado: data.custoInformado !== null && data.custoInformado !== undefined ? new Decimal(data.custoInformado) : null,
          CustoTabela: data.custoTabela !== null && data.custoTabela !== undefined ? new Decimal(data.custoTabela) : null,
          Medio: data.medio !== null && data.medio !== undefined ? new Decimal(data.medio) : null,
          Ultimo: data.ultimo !== null && data.ultimo !== undefined ? new Decimal(data.ultimo) : null,
          MarkUpTabela: data.markupTabela !== null && data.markupTabela !== undefined ? Number(data.markupTabela) : null,
          DescontoMaximo: data.descontoMaximo !== null && data.descontoMaximo !== undefined ? Number(data.descontoMaximo) : null,
          Comissao: data.comissao !== null && data.comissao !== undefined ? new Decimal(data.comissao) : null,
          
          Minimo: data.minimo !== null && data.minimo !== undefined ? new Decimal(data.minimo) : null,
          EstoqueMaximo: data.estoqueMaximo !== null && data.estoqueMaximo !== undefined ? new Decimal(data.estoqueMaximo) : null,
          Localizacao: data.localizacao || null,
          Peso: data.peso !== null && data.peso !== undefined ? new Decimal(data.peso) : null,
          PesoLiquido: data.pesoLiquido !== null && data.pesoLiquido !== undefined ? Number(data.pesoLiquido) : null,
          Largura: data.largura !== null && data.largura !== undefined ? new Decimal(data.largura) : null,
          Altura: data.altura !== null && data.altura !== undefined ? new Decimal(data.altura) : null,
          Comprimento: data.comprimento !== null && data.comprimento !== undefined ? Number(data.comprimento) : null,
          Area: data.area !== null && data.area !== undefined ? new Decimal(data.area) : null,
          AreaM3: data.areaM3 !== null && data.areaM3 !== undefined ? Number(data.areaM3) : null,
          
          ClassificacaoFiscal: data.classificacaoFiscal || null,
          CSOSN: data.csosn || null,
          CFOPVenda: data.cfopVenda || null,
          CFOPCompra: data.cfopCompra || null,
          IPI: data.ipi !== null && data.ipi !== undefined ? new Decimal(data.ipi) : null,
          ICMS: data.icms !== null && data.icms !== undefined ? new Decimal(data.icms) : null,
          Frete: data.frete !== null && data.frete !== undefined ? new Decimal(data.frete) : null,
          
          Obs: data.obs || null,
          Aplicacao: data.aplicacao || null,
          Caracteristicas: data.caracteristicas || null,
          BalancoAuditoria: data.balancoAuditoria !== null && data.balancoAuditoria !== undefined ? Number(data.balancoAuditoria) : null,
          DiasGarantia: data.diasGarantia !== null && data.diasGarantia !== undefined ? Number(data.diasGarantia) : null,
          ECommerce: data.eCommerce ? "S" : "N",
          Data: new Date(),
        },
      });

      return {
        id: newServ.CodPro,
        nome: newServ.Produto || "",
        codigo: newServ.Referencia || "",
        preco: newServ.Preco1 instanceof Decimal ? newServ.Preco1.toNumber() : Number(newServ.Preco1 ?? 0),
        estoque: newServ.Estoque instanceof Decimal ? newServ.Estoque.toNumber() : Number(newServ.Estoque ?? 0),
        categoria: newServ.Categoria || "",
        descricao: newServ.Complemento || "",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live createService SQL error:", err);
      throw new Error("Falha ao registrar serviço no catálogo unificado.");
    }
  },

  async updateProduct(codPro: number, data: any) {
    console.log(`[SoftLine DB] Updating product: ${codPro}`);
    try {
      const updateData: any = {};
      if (data.nome !== undefined) updateData.Produto = data.nome || null;
      if (data.codigo !== undefined) updateData.Referencia = data.codigo || null;
      if (data.preco !== undefined) updateData.Preco1 = data.preco !== null ? new Decimal(data.preco) : null;
      if (data.estoque !== undefined) updateData.Estoque = data.estoque !== null ? new Decimal(data.estoque) : null;
      if (data.categoria !== undefined) updateData.Categoria = data.categoria || "Acessórios";
      if (data.descricao !== undefined) updateData.Complemento = data.descricao || null;
      
      // Novos campos opcionais para atualizar
      if (data.abreviado !== undefined) updateData.Abreviado = data.abreviado || null;
      if (data.marca !== undefined) updateData.Marca = data.marca || null;
      if (data.fabricante !== undefined) updateData.Fabricante = data.fabricante || null;
      if (data.codigoBarras !== undefined) updateData.CodigoBarras = data.codigoBarras || null;
      if (data.unidade !== undefined) updateData.Unidade = data.unidade || null;
      if (data.inativo !== undefined) updateData.Inativo = data.inativo ? "S" : "N";
      
      if (data.preco2 !== undefined) updateData.Preco2 = data.preco2 !== null ? new Decimal(data.preco2) : null;
      if (data.preco3 !== undefined) updateData.Preco3 = data.preco3 !== null ? new Decimal(data.preco3) : null;
      if (data.preco4 !== undefined) updateData.Preco4 = data.preco4 !== null ? new Decimal(data.preco4) : null;
      if (data.custo !== undefined) updateData.Custo = data.custo !== null ? new Decimal(data.custo) : null;
      if (data.custoInformado !== undefined) updateData.CustoInformado = data.custoInformado !== null ? new Decimal(data.custoInformado) : null;
      if (data.custoTabela !== undefined) updateData.CustoTabela = data.custoTabela !== null ? new Decimal(data.custoTabela) : null;
      if (data.medio !== undefined) updateData.Medio = data.medio !== null ? new Decimal(data.medio) : null;
      if (data.ultimo !== undefined) updateData.Ultimo = data.ultimo !== null ? new Decimal(data.ultimo) : null;
      if (data.markupTabela !== undefined) updateData.MarkUpTabela = data.markupTabela !== null ? Number(data.markupTabela) : null;
      if (data.descontoMaximo !== undefined) updateData.DescontoMaximo = data.descontoMaximo !== null ? Number(data.descontoMaximo) : null;
      if (data.comissao !== undefined) updateData.Comissao = data.comissao !== null ? new Decimal(data.comissao) : null;
      
      if (data.minimo !== undefined) updateData.Minimo = data.minimo !== null ? new Decimal(data.minimo) : null;
      if (data.estoqueMaximo !== undefined) updateData.EstoqueMaximo = data.estoqueMaximo !== null ? new Decimal(data.estoqueMaximo) : null;
      if (data.localizacao !== undefined) updateData.Localizacao = data.localizacao || null;
      if (data.peso !== undefined) updateData.Peso = data.peso !== null ? new Decimal(data.peso) : null;
      if (data.pesoLiquido !== undefined) updateData.PesoLiquido = data.pesoLiquido !== null ? Number(data.pesoLiquido) : null;
      if (data.largura !== undefined) updateData.Largura = data.largura !== null ? new Decimal(data.largura) : null;
      if (data.altura !== undefined) updateData.Altura = data.altura !== null ? new Decimal(data.altura) : null;
      if (data.comprimento !== undefined) updateData.Comprimento = data.comprimento !== null ? Number(data.comprimento) : null;
      if (data.area !== undefined) updateData.Area = data.area !== null ? new Decimal(data.area) : null;
      if (data.areaM3 !== undefined) updateData.AreaM3 = data.areaM3 !== null ? Number(data.areaM3) : null;
      
      if (data.classificacaoFiscal !== undefined) updateData.ClassificacaoFiscal = data.classificacaoFiscal || null;
      if (data.csosn !== undefined) updateData.CSOSN = data.csosn || null;
      if (data.cfopVenda !== undefined) updateData.CFOPVenda = data.cfopVenda || null;
      if (data.cfopCompra !== undefined) updateData.CFOPCompra = data.cfopCompra || null;
      if (data.ipi !== undefined) updateData.IPI = data.ipi !== null ? new Decimal(data.ipi) : null;
      if (data.icms !== undefined) updateData.ICMS = data.icms !== null ? new Decimal(data.icms) : null;
      if (data.frete !== undefined) updateData.Frete = data.frete !== null ? new Decimal(data.frete) : null;
      
      if (data.obs !== undefined) updateData.Obs = data.obs || null;
      if (data.aplicacao !== undefined) updateData.Aplicacao = data.aplicacao || null;
      if (data.caracteristicas !== undefined) updateData.Caracteristicas = data.caracteristicas || null;
      if (data.balancoAuditoria !== undefined) updateData.BalancoAuditoria = data.balancoAuditoria !== null ? Number(data.balancoAuditoria) : null;
      if (data.diasGarantia !== undefined) updateData.DiasGarantia = data.diasGarantia !== null ? Number(data.diasGarantia) : null;
      if (data.eCommerce !== undefined) updateData.ECommerce = data.eCommerce ? "S" : "N";

      const updatedProd = await prisma.produto.update({
        where: { CodPro: codPro },
        data: updateData,
      });

      return {
        id: updatedProd.CodPro,
        nome: updatedProd.Produto || "",
        codigo: updatedProd.Referencia || "",
        preco: updatedProd.Preco1 instanceof Decimal ? updatedProd.Preco1.toNumber() : Number(updatedProd.Preco1 ?? 0),
        estoque: updatedProd.Estoque instanceof Decimal ? updatedProd.Estoque.toNumber() : Number(updatedProd.Estoque ?? 0),
        categoria: updatedProd.Categoria || "",
        descricao: updatedProd.Complemento || "",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live updateProduct SQL error:", err);
      throw new Error("Falha ao atualizar produto no catálogo de estoque.");
    }
  },

  async deleteProduct(codPro: number) {
    console.log(`[SoftLine DB] Deleting product: ${codPro}`);
    try {
      await prisma.produto.delete({
        where: { CodPro: codPro },
      });
      return { success: true };
    } catch (err) {
      console.error("[SoftLine DB] Live deleteProduct SQL error:", err);
      throw new Error("Falha ao excluir produto no banco de dados.");
    }
  },

  async updateUser(codUsu: number, data: any) {
    console.log(`[SoftLine DB] Updating user: ${codUsu}`);
    try {
      const updateData: any = {};
      if (data.nome !== undefined) updateData.Usuario = data.nome;
      if (data.usuario !== undefined) updateData.Usuario = data.usuario;
      if (data.senha !== undefined) updateData.Senha = data.senha;
      if (data.inativo !== undefined) updateData.Inativo = data.inativo ? "S" : "N";
      if (data.compromisso !== undefined) updateData.Compromisso = data.compromisso ? "S" : "N";
      if (data.descMaximo !== undefined) updateData.DescMaximo = data.descMaximo !== null ? new Decimal(data.descMaximo) : null;
      if (data.descMaximoAtacado !== undefined) updateData.DescMaximoAtacado = data.descMaximoAtacado !== null ? Number(data.descMaximoAtacado) : null;
      if (data.descMaximoST !== undefined) updateData.DescMaximoST = data.descMaximoST !== null ? Number(data.descMaximoST) : null;
      if (data.totalMaximoCompra !== undefined) updateData.TotalMaximoCompra = data.totalMaximoCompra !== null ? Number(data.totalMaximoCompra) : null;
      if (data.trabalhoInicio !== undefined) updateData.TrabalhoInicio = data.trabalhoInicio || null;
      if (data.trabalhoFim !== undefined) updateData.TrabalhoFim = data.trabalhoFim || null;
      if (data.trabalhoDom !== undefined) updateData.TrabalhoDom = data.trabalhoDom ? "S" : "N";
      if (data.trabalhoSeg !== undefined) updateData.TrabalhoSeg = data.trabalhoSeg ? "S" : "N";
      if (data.trabalhoTer !== undefined) updateData.TrabalhoTer = data.trabalhoTer ? "S" : "N";
      if (data.trabalhoQua !== undefined) updateData.TrabalhoQua = data.trabalhoQua ? "S" : "N";
      if (data.trabalhoQui !== undefined) updateData.TrabalhoQui = data.trabalhoQui ? "S" : "N";
      if (data.trabalhoSex !== undefined) updateData.TrabalhoSex = data.trabalhoSex ? "S" : "N";
      if (data.trabalhoSab !== undefined) updateData.TrabalhoSab = data.trabalhoSab ? "S" : "N";
      if (data.emailAlternativo !== undefined) updateData.EmailAlternativo = data.emailAlternativo || null;
      if (data.email !== undefined) updateData.EMail = data.email || null;
      if (data.spool !== undefined) updateData.Spool = data.spool || null;
      if (data.tipoPreco !== undefined) updateData.Tipo_Preco = data.tipoPreco || null;

      // Set permission flags matching our dynamic SQL Server mapping
      if (data.permissions !== undefined) {
        for (const [key, value] of Object.entries(data.permissions)) {
          const dbKey = getDbPermissionKey(key);
          if (typeof value === "boolean") {
            updateData[dbKey] = value ? "S" : "N";
          } else {
            updateData[dbKey] = String(value);
          }
        }
      }

      // Enforce Admin/Supervisor flag based on select role
      if (data.role === "Administrador") {
        updateData["Op91"] = "S";
      } else if (data.role === "Supervisor") {
        updateData["OP13"] = "S";
      } else if (data.role === "Operador") {
        updateData["Op91"] = "N";
        updateData["OP13"] = "N";
      }

      const updatedUser = await prisma.senha.update({
        where: { CodUsu: codUsu },
        data: updateData,
      });

      return {
        id: updatedUser.CodUsu,
        nome: updatedUser.Usuario || "",
        usuario: updatedUser.Usuario || "",
        role: data.role || "Operador",
        inativo: updatedUser.Inativo === "S",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live updateUser SQL error:", err);
      throw new Error("Falha ao atualizar conta de usuário no banco de dados.");
    }
  },

  async deleteUser(codUsu: number) {
    console.log(`[SoftLine DB] Deleting user: ${codUsu}`);
    try {
      await prisma.senha.delete({
        where: { CodUsu: codUsu },
      });
      return { success: true };
    } catch (err) {
      console.error("[SoftLine DB] Live deleteUser SQL error:", err);
      throw new Error("Falha ao excluir conta de usuário no banco de dados.");
    }
  },

  async updateCollaborator(codInd: number, data: any) {
    console.log(`[SoftLine DB] Updating collaborator: ${codInd}`);
    try {
      const updateData: any = {};
      if (data.nome !== undefined) updateData.Indicador = data.nome;
      if (data.razao !== undefined) updateData.Razao = data.razao || null;
      if (data.tipo !== undefined) updateData.Tipo = data.tipo || "F";
      if (data.cpf !== undefined) updateData.CPF = data.cpf || null;
      if (data.rg !== undefined) updateData.RG = data.rg || null;
      if (data.orgao !== undefined) updateData.Orgao = data.orgao || null;
      if (data.cnpj !== undefined) updateData.CGC = data.cnpj || null;
      if (data.ie !== undefined) updateData.IE = data.ie || null;
      if (data.im !== undefined) updateData.IM = data.im || null;
      if (data.cargo !== undefined) updateData.Cargo = data.cargo || null;
      if (data.departamento !== undefined) updateData.Departamento = data.departamento || null;
      if (data.endereco !== undefined) updateData.Endereco = data.endereco || null;
      if (data.bairro !== undefined) updateData.Bairro = data.bairro || null;
      if (data.cidade !== undefined) updateData.Cidade = data.cidade || null;
      if (data.estado !== undefined) updateData.Estado = data.estado || null;
      if (data.cep !== undefined) updateData.CEP = data.cep || null;
      if (data.email !== undefined) updateData.EMail = data.email || null;
      if (data.site !== undefined) updateData.Site = data.site || null;
      if (data.telefone !== undefined) updateData.Tel = data.telefone || null;
      if (data.celular !== undefined) updateData.Cel = data.celular || null;
      if (data.pis !== undefined) updateData.PIS = data.pis || null;
      if (data.ctps !== undefined) updateData.CTPS = data.ctps || null;
      if (data.localNasc !== undefined) updateData.Local_Nasc = data.localNasc || null;
      if (data.estadoCivil !== undefined) updateData.Estado_Civil = data.estadoCivil || null;
      if (data.filiacaoPai !== undefined) updateData.Filiacao_Pai = data.filiacaoPai || null;
      if (data.filiacaoMae !== undefined) updateData.Filiacao_Mae = data.filiacaoMae || null;
      
      if (data.emissaoRg !== undefined) {
        updateData.Emissao_RG = data.emissaoRg ? new Date(data.emissaoRg) : null;
      }
      
      if (data.nasc !== undefined) {
        if (data.nasc) {
          const parts = data.nasc.split("-");
          if (parts.length === 3) {
            updateData.Ano_Nasc = parseInt(parts[0]);
            updateData.Mes_Nasc = parseInt(parts[1]);
            updateData.Dia_Nasc = parseInt(parts[2]);
          }
        } else {
          updateData.Ano_Nasc = null;
          updateData.Mes_Nasc = null;
          updateData.Dia_Nasc = null;
        }
      }

      if (data.grauInstrucao !== undefined) updateData.Grau_Instrucao = data.grauInstrucao || null;
      if (data.sexo !== undefined) updateData.Sexo = data.sexo || "M";
      if (data.observacao !== undefined) updateData.Observacao = data.observacao || null;
      
      if (data.salarioBase !== undefined) updateData.SalarioBase = data.salarioBase !== null ? Number(data.salarioBase) : null;
      if (data.alimentacao !== undefined) updateData.Alimentacao = data.alimentacao !== null ? Number(data.alimentacao) : null;
      if (data.transporte !== undefined) updateData.Transporte = data.transporte !== null ? Number(data.transporte) : null;
      if (data.codUsu !== undefined) updateData.CodUsu = data.codUsu !== null ? Number(data.codUsu) : null;
      
      if (data.chave !== undefined) updateData.Chave = data.chave || null;
      if (data.registro !== undefined) updateData.Registro = data.registro || null;
      if (data.conselho !== undefined) updateData.Conselho = data.conselho || null;
      if (data.situacao !== undefined) updateData.Situacao = data.situacao || "A";
      if (data.inativo !== undefined) updateData.Inativo = data.inativo ? "S" : "N";

      const updatedCol = await prisma.indicado.update({
        where: { CodInd: codInd },
        data: updateData,
      });

      return {
        id: updatedCol.CodInd,
        nome: updatedCol.Indicador || "",
        email: updatedCol.EMail || "",
        telefone: updatedCol.Tel || "",
        cargo: updatedCol.Cargo || "",
        situacao: updatedCol.Situacao || "A",
      };
    } catch (err) {
      console.error("[SoftLine DB] Live updateCollaborator SQL error:", err);
      throw new Error("Falha ao atualizar colaborador no banco de dados.");
    }
  },

  async deleteCollaborator(codInd: number) {
    console.log(`[SoftLine DB] Deleting collaborator: ${codInd}`);
    try {
      await prisma.indicado.delete({
        where: { CodInd: codInd },
      });
      return { success: true };
    } catch (err) {
      console.error("[SoftLine DB] Live deleteCollaborator SQL error:", err);
      throw new Error("Falha ao excluir colaborador no banco de dados.");
    }
  },

  // CLIENTES (tabela CLIENTEs)
  async getClientes(params: {
    search?: string;
    statusFilter?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    console.log(`[SoftLine DB] Listing paginated CLIENTEs (page: ${page}, limit: ${limit})...`);

    const whereClause: any = {};

    if (params.search) {
      whereClause.OR = [
        { Cliente: { contains: params.search } },
        { Razao: { contains: params.search } },
        { CGC: { contains: params.search } },
        { CPF: { contains: params.search } },
      ];
    }

    if (params.statusFilter && params.statusFilter !== "TODOS") {
      whereClause.Situacao = params.statusFilter; // "A" para ativo, "I" ou outro para inativo
    }

    try {
      const total = await prisma.cLIENTEs.count({ where: whereClause });

      const items = await prisma.cLIENTEs.findMany({
        where: whereClause,
        orderBy: {
          CodCli: "asc",
        },
        skip,
        take: limit,
      });

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (err) {
      console.error("[SoftLine DB] Live getClientes SQL error:", err);
      return { items: [], total: 0, page: 1, limit: 50, pages: 0 };
    }
  },

  async createCliente(data: any) {
    console.log(`[SoftLine DB] Creating client: ${data.cliente}`);
    try {
      const lastCli = await prisma.cLIENTEs.findFirst({
        orderBy: {
          CodCli: "desc",
        },
        select: {
          CodCli: true,
        },
      });
      const nextCodCli = lastCli ? lastCli.CodCli + 1 : 1;

      const dbData: any = {
        CodCli: nextCodCli,
        Cliente: data.cliente || null,
        Razao: data.razao || null,
        Complemento: data.complemento || null,
        Caminho: data.caminho || null,
        Site: data.site || null,
        Endereco: data.endereco || null,
        Bairro: data.bairro || null,
        Cidade: data.cidade || null,
        Estado: data.estado || null,
        Cep: data.cep || null,
        Tel: data.tel || null,
        Tel2: data.tel2 || null,
        
        EndCob: data.endCob || null,
        BairroCob: data.bairroCob || null,
        CidCob: data.cidCob || null,
        EstCob: data.estCob || null,
        CepCob: data.cepCob || null,
        TelCob: data.telCob || null,
        TelCob2: data.telCob2 || null,

        EndEnt: data.endEnt || null,
        BairroEnt: data.bairroEnt || null,
        CidEnt: data.cidEnt || null,
        EstEnt: data.estEnt || null,
        CepEnt: data.cepEnt || null,
        TelEnt: data.telEnt || null,
        TelEnt2: data.telEnt2 || null,

        CPF: data.cpf || null,
        RG: data.rg || null,
        Orgao: data.orgao || null,
        CGC: data.cnpj || null,
        IE: data.ie || null,
        IM: data.im || null,
        
        Situacao: data.situacao || "A",
        Tipo: data.tipo || "F",
        Sexo: data.sexo || "M",
        
        Limite: data.limite !== undefined ? new Decimal(data.limite) : null,
        Acordo: data.acordo !== undefined ? new Decimal(data.acordo) : null,
        
        Cargo: data.cargo || null,
        Departamento: data.departamento || null,
        
        Renda1: data.renda1 !== undefined ? new Decimal(data.renda1) : null,
        Renda2: data.renda2 !== undefined ? new Decimal(data.renda2) : null,
        
        Banco1: data.banco1 || null,
        Agencia1: data.agencia1 || null,
        Conta1: data.conta1 || null,
        Banco2: data.banco2 || null,
        Agencia2: data.agencia2 || null,
        Conta2: data.conta2 || null,

        FiliacaoPai: data.filiacaoPai || null,
        FiliacaoMae: data.filiacaoMae || null,
        EMail: data.email || null,
        Observacao: data.observacao || null,
        
        DataCad: new Date(),
      };

      if (data.nasc) {
        const parts = data.nasc.split("-");
        if (parts.length === 3) {
          dbData.Ano_Nasc = parseInt(parts[0]);
          dbData.Mes_Nasc = parseInt(parts[1]);
          dbData.Dia_Nasc = parseInt(parts[2]);
        }
      }

      if (data.emissaoRg) {
        dbData.EmissaoRG = new Date(data.emissaoRg);
      }

      const newCli = await prisma.cLIENTEs.create({
        data: dbData,
      });

      return newCli;
    } catch (err) {
      console.error("[SoftLine DB] Live createCliente SQL error:", err);
      throw new Error("Falha ao cadastrar cliente no banco de dados.");
    }
  },

  async updateCliente(codCli: number, data: any) {
    console.log(`[SoftLine DB] Updating client: ${codCli}`);
    try {
      const updateData: any = {};
      if (data.cliente !== undefined) updateData.Cliente = data.cliente || null;
      if (data.razao !== undefined) updateData.Razao = data.razao || null;
      if (data.complemento !== undefined) updateData.Complemento = data.complemento || null;
      if (data.caminho !== undefined) updateData.Caminho = data.caminho || null;
      if (data.site !== undefined) updateData.Site = data.site || null;
      if (data.endereco !== undefined) updateData.Endereco = data.endereco || null;
      if (data.bairro !== undefined) updateData.Bairro = data.bairro || null;
      if (data.cidade !== undefined) updateData.Cidade = data.cidade || null;
      if (data.estado !== undefined) updateData.Estado = data.estado || null;
      if (data.cep !== undefined) updateData.Cep = data.cep || null;
      if (data.tel !== undefined) updateData.Tel = data.tel || null;
      if (data.tel2 !== undefined) updateData.Tel2 = data.tel2 || null;

      if (data.endCob !== undefined) updateData.EndCob = data.endCob || null;
      if (data.bairroCob !== undefined) updateData.BairroCob = data.bairroCob || null;
      if (data.cidCob !== undefined) updateData.CidCob = data.cidCob || null;
      if (data.estCob !== undefined) updateData.EstCob = data.estCob || null;
      if (data.cepCob !== undefined) updateData.CepCob = data.cepCob || null;
      if (data.telCob !== undefined) updateData.TelCob = data.telCob || null;
      if (data.telCob2 !== undefined) updateData.TelCob2 = data.telCob2 || null;

      if (data.endEnt !== undefined) updateData.EndEnt = data.endEnt || null;
      if (data.bairroEnt !== undefined) updateData.BairroEnt = data.bairroEnt || null;
      if (data.cidEnt !== undefined) updateData.CidEnt = data.cidEnt || null;
      if (data.estEnt !== undefined) updateData.EstEnt = data.estEnt || null;
      if (data.cepEnt !== undefined) updateData.CepEnt = data.cepEnt || null;
      if (data.telEnt !== undefined) updateData.TelEnt = data.telEnt || null;
      if (data.telEnt2 !== undefined) updateData.TelEnt2 = data.telEnt2 || null;

      if (data.cpf !== undefined) updateData.CPF = data.cpf || null;
      if (data.rg !== undefined) updateData.RG = data.rg || null;
      if (data.orgao !== undefined) updateData.Orgao = data.orgao || null;
      if (data.cnpj !== undefined) updateData.CGC = data.cnpj || null;
      if (data.ie !== undefined) updateData.IE = data.ie || null;
      if (data.im !== undefined) updateData.IM = data.im || null;

      if (data.situacao !== undefined) updateData.Situacao = data.situacao || "A";
      if (data.tipo !== undefined) updateData.Tipo = data.tipo || "F";
      if (data.sexo !== undefined) updateData.Sexo = data.sexo || "M";

      if (data.limite !== undefined) updateData.Limite = data.limite !== null ? new Decimal(data.limite) : null;
      if (data.acordo !== undefined) updateData.Acordo = data.acordo !== null ? new Decimal(data.acordo) : null;

      if (data.cargo !== undefined) updateData.Cargo = data.cargo || null;
      if (data.departamento !== undefined) updateData.Departamento = data.departamento || null;

      if (data.renda1 !== undefined) updateData.Renda1 = data.renda1 !== null ? new Decimal(data.renda1) : null;
      if (data.renda2 !== undefined) updateData.Renda2 = data.renda2 !== null ? new Decimal(data.renda2) : null;

      if (data.banco1 !== undefined) updateData.Banco1 = data.banco1 || null;
      if (data.agencia1 !== undefined) updateData.Agencia1 = data.agencia1 || null;
      if (data.conta1 !== undefined) updateData.Conta1 = data.conta1 || null;
      
      if (data.banco2 !== undefined) updateData.Banco2 = data.banco2 || null;
      if (data.agencia2 !== undefined) updateData.Agencia2 = data.agencia2 || null;
      if (data.conta2 !== undefined) updateData.Conta2 = data.conta2 || null;

      if (data.filiacaoPai !== undefined) updateData.FiliacaoPai = data.filiacaoPai || null;
      if (data.filiacaoMae !== undefined) updateData.FiliacaoMae = data.filiacaoMae || null;
      if (data.email !== undefined) updateData.EMail = data.email || null;
      if (data.observacao !== undefined) updateData.Observacao = data.observacao || null;

      if (data.nasc !== undefined) {
        if (data.nasc) {
          const parts = data.nasc.split("-");
          if (parts.length === 3) {
            updateData.Ano_Nasc = parseInt(parts[0]);
            updateData.Mes_Nasc = parseInt(parts[1]);
            updateData.Dia_Nasc = parseInt(parts[2]);
          }
        } else {
          updateData.Ano_Nasc = null;
          updateData.Mes_Nasc = null;
          updateData.Dia_Nasc = null;
        }
      }

      if (data.emissaoRg !== undefined) {
        updateData.EmissaoRG = data.emissaoRg ? new Date(data.emissaoRg) : null;
      }

      const updatedCli = await prisma.cLIENTEs.update({
        where: { CodCli: codCli },
        data: updateData,
      });

      return updatedCli;
    } catch (err) {
      console.error("[SoftLine DB] Live updateCliente SQL error:", err);
      throw new Error("Falha ao atualizar cliente no banco de dados.");
    }
  },

  async deleteCliente(codCli: number) {
    console.log(`[SoftLine DB] Deleting client: ${codCli}`);
    try {
      await prisma.cLIENTEs.delete({
        where: { CodCli: codCli },
      });
      return { success: true };
    } catch (err) {
      console.error("[SoftLine DB] Live deleteCliente SQL error:", err);
      throw new Error("Falha ao excluir cliente no banco de dados.");
    }
  },

  async getFornecedores(params?: {
    search?: string;
    statusFilter?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.search) {
      const term = params.search.trim();
      const whereConditions: any[] = [];

      if (/^\d+$/.test(term)) {
        whereConditions.push({ CodFor: parseInt(term) });
      }

      whereConditions.push(
        { Fornec: { contains: term } },
        { Razao: { contains: term } },
        { CGC: { contains: term } },
        { CPF: { contains: term } },
        { Cidade: { contains: term } }
      );

      where.OR = whereConditions;
    }

    if (params?.statusFilter && params.statusFilter !== "TODOS") {
      where.Situacao = params.statusFilter;
    }

    try {
      const [items, total] = await Promise.all([
        prisma.fornec.findMany({
          where,
          skip,
          take: limit,
          orderBy: { CodFor: "desc" },
          select: {
            CodFor: true,
            Fornec: true,
            Razao: true,
            Complemento: true,
            Site: true,
            Endereco: true,
            Bairro: true,
            Cidade: true,
            Estado: true,
            Cep: true,
            Tel: true,
            Tel2: true,
            CPF: true,
            CGC: true,
            IE: true,
            IM: true,
            Situacao: true,
            Tipo: true,
            EMail: true,
            DataCad: true,
            Observacao: true,
            Banco1: true,
            Agencia1: true,
            Conta1: true,
            Banco2: true,
            Agencia2: true,
            Conta2: true,
            Dia_Nasc: true,
            Mes_Nasc: true,
            Ano_Nasc: true,
            RG: true,
            Orgao: true,
          },
        }),
        prisma.fornec.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (err) {
      console.error("[SoftLine DB] Live getFornecedores SQL error:", err);
      throw new Error("Falha ao obter fornecedores do banco de dados.");
    }
  },

  async createFornecedor(data: any) {
    console.log("[SoftLine DB] Live createFornecedor database operation triggered.");
    try {
      const lastFor = await prisma.fornec.findFirst({
        orderBy: { CodFor: "desc" },
        select: { CodFor: true },
      });
      const nextCod = (lastFor?.CodFor || 0) + 1;

      const dbData: any = {
        CodFor: nextCod,
        Fornec: data.fornec || null,
        Razao: data.razao || null,
        Complemento: data.complemento || null,
        Site: data.site || null,
        Endereco: data.endereco || null,
        Bairro: data.bairro || null,
        Cidade: data.cidade || null,
        Estado: data.estado || null,
        Cep: data.cep || null,
        Tel: data.tel || null,
        Tel2: data.tel2 || null,
        
        CPF: data.cpf || null,
        RG: data.rg || null,
        Orgao: data.orgao || null,
        CGC: data.cnpj || null,
        IE: data.ie || null,
        IM: data.im || null,
        
        Situacao: data.situacao || "A",
        Tipo: data.tipo || "F",
        EMail: data.email || null,
        Observacao: data.observacao || null,
        
        Banco1: data.banco1 || null,
        Agencia1: data.agencia1 || null,
        Conta1: data.conta1 || null,
        Banco2: data.banco2 || null,
        Agencia2: data.agencia2 || null,
        Conta2: data.conta2 || null,

        DataCad: new Date(),
      };

      if (data.nasc) {
        const parts = data.nasc.split("-");
        if (parts.length === 3) {
          dbData.Ano_Nasc = parseInt(parts[0]);
          dbData.Mes_Nasc = parseInt(parts[1]);
          dbData.Dia_Nasc = parseInt(parts[2]);
        }
      }

      const newFor = await prisma.fornec.create({
        data: dbData,
      });

      return newFor;
    } catch (err) {
      console.error("[SoftLine DB] Live createFornecedor SQL error:", err);
      throw new Error("Falha ao cadastrar fornecedor no banco de dados.");
    }
  },

  async updateFornecedor(codFor: number, data: any) {
    console.log(`[SoftLine DB] Updating supplier: ${codFor}`);
    try {
      const updateData: any = {};
      if (data.fornec !== undefined) updateData.Fornec = data.fornec || null;
      if (data.razao !== undefined) updateData.Razao = data.razao || null;
      if (data.complemento !== undefined) updateData.Complemento = data.complemento || null;
      if (data.site !== undefined) updateData.Site = data.site || null;
      if (data.endereco !== undefined) updateData.Endereco = data.endereco || null;
      if (data.bairro !== undefined) updateData.Bairro = data.bairro || null;
      if (data.cidade !== undefined) updateData.Cidade = data.cidade || null;
      if (data.estado !== undefined) updateData.Estado = data.estado || null;
      if (data.cep !== undefined) updateData.Cep = data.cep || null;
      if (data.tel !== undefined) updateData.Tel = data.tel || null;
      if (data.tel2 !== undefined) updateData.Tel2 = data.tel2 || null;

      if (data.cpf !== undefined) updateData.CPF = data.cpf || null;
      if (data.rg !== undefined) updateData.RG = data.rg || null;
      if (data.orgao !== undefined) updateData.Orgao = data.orgao || null;
      if (data.cnpj !== undefined) updateData.CGC = data.cnpj || null;
      if (data.ie !== undefined) updateData.IE = data.ie || null;
      if (data.im !== undefined) updateData.IM = data.im || null;

      if (data.situacao !== undefined) updateData.Situacao = data.situacao || "A";
      if (data.tipo !== undefined) updateData.Tipo = data.tipo || "F";
      if (data.email !== undefined) updateData.EMail = data.email || null;
      if (data.observacao !== undefined) updateData.Observacao = data.observacao || null;

      if (data.banco1 !== undefined) updateData.Banco1 = data.banco1 || null;
      if (data.agencia1 !== undefined) updateData.Agencia1 = data.agencia1 || null;
      if (data.conta1 !== undefined) updateData.Conta1 = data.conta1 || null;
      
      if (data.banco2 !== undefined) updateData.Banco2 = data.banco2 || null;
      if (data.agencia2 !== undefined) updateData.Agencia2 = data.agencia2 || null;
      if (data.conta2 !== undefined) updateData.Conta2 = data.conta2 || null;

      if (data.nasc !== undefined) {
        if (data.nasc) {
          const parts = data.nasc.split("-");
          if (parts.length === 3) {
            updateData.Ano_Nasc = parseInt(parts[0]);
            updateData.Mes_Nasc = parseInt(parts[1]);
            updateData.Dia_Nasc = parseInt(parts[2]);
          }
        } else {
          updateData.Ano_Nasc = null;
          updateData.Mes_Nasc = null;
          updateData.Dia_Nasc = null;
        }
      }

      const updatedFor = await prisma.fornec.update({
        where: { CodFor: codFor },
        data: updateData,
      });

      return updatedFor;
    } catch (err) {
      console.error("[SoftLine DB] Live updateFornecedor SQL error:", err);
      throw new Error("Falha ao atualizar fornecedor no banco de dados.");
    }
  },

  async deleteFornecedor(codFor: number) {
    console.log(`[SoftLine DB] Deleting supplier: ${codFor}`);
    try {
      await prisma.fornec.delete({
        where: { CodFor: codFor },
      });
      return { success: true };
    } catch (err) {
      console.error("[SoftLine DB] Live deleteFornecedor SQL error:", err);
      throw new Error("Falha ao excluir fornecedor no banco de dados.");
    }
  },
};

export type DbService = typeof dbService;
