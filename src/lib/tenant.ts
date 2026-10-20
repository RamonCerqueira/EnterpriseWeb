import "server-only";

import { headers } from "next/headers";
import tenantConfig from "../../config/tenants.json";

export interface TenantConfig {
  id: string;
  databaseUrlEnv: string;
  hosts: string[];
}

interface TenantsFile {
  defaultTenant: string;
  defaultHosts: string[];
  tenants: TenantConfig[];
}

const config = tenantConfig as TenantsFile;

function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

export function getDefaultTenant(): TenantConfig {
  const tenant = config.tenants.find((item) => item.id === config.defaultTenant);
  if (!tenant) throw new Error(`Tenant padr\u00e3o '${config.defaultTenant}' n\u00e3o existe em config/tenants.json.`);
  return tenant;
}

/** A hostname never becomes a connection string or database name by itself. */
export function getTenantForHost(host: string | null | undefined): TenantConfig {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost || config.defaultHosts.map(normalizeHost).includes(normalizedHost)) return getDefaultTenant();

  const tenant = config.tenants.find((item) => item.hosts.map(normalizeHost).includes(normalizedHost));
  if (!tenant) throw new Error(`Host '${normalizedHost}' n\u00e3o est\u00e1 configurado como tenant.`);
  return tenant;
}

export async function getCurrentTenant(): Promise<TenantConfig> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  return getTenantForHost(host?.split(",")[0]);
}
