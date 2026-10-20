# Configura\u00e7\u00e3o de tenants

Edite `config/tenants.json` para cadastrar os hosts de cada empresa. O arquivo
define o roteamento; as credenciais ficam exclusivamente em vari\u00e1veis de
ambiente.

```json
{
  "id": "acme",
  "databaseUrlEnv": "TENANT_ACME_DATABASE_URL",
  "hosts": ["acme.seusistema.com", "acme.localhost"]
}
```

No ambiente de publica\u00e7\u00e3o, configure:

```text
DATABASE_URL=sqlserver://...;database=SoftLineDefault;...
TENANT_ACME_DATABASE_URL=sqlserver://...;database=SoftLineAcme;...
```

`DATABASE_URL` \u00e9 o banco j\u00e1 existente e permanece como fallback para os
hosts definidos em `defaultHosts` (por exemplo, `localhost` e o dom\u00ednio
principal). Adicione o dom\u00ednio de produ\u00e7\u00e3o principal a essa lista antes de
publicar.

Todo subdom\u00ednio de cliente deve estar explicitamente listado em `hosts`. Um
host desconhecido n\u00e3o recebe acesso ao banco padr\u00e3o. Depois de editar o JSON,
publique uma nova vers\u00e3o da aplica\u00e7\u00e3o e aplique a mesma migra\u00e7\u00e3o Prisma no
banco novo antes de ativar o DNS.
