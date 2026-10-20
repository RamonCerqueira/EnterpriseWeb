import "server-only";

import { PrismaClient } from "@prisma/client";
import { getCurrentTenant, type TenantConfig } from "@/lib/tenant";

const MAX_CACHED_TENANT_CLIENTS = 20;

type CachedClient = { client: PrismaClient; lastUsedAt: number };

const globalForPrisma = globalThis as unknown as {
  tenantPrismaClients: Map<string, CachedClient> | undefined;
};

const clients = globalForPrisma.tenantPrismaClients ?? new Map<string, CachedClient>();

if (process.env.NODE_ENV !== "production") globalForPrisma.tenantPrismaClients = clients;

function getDatabaseUrl(tenant: TenantConfig): string {
  const url = process.env[tenant.databaseUrlEnv];
  if (!url) throw new Error(`A vari\u00e1vel ${tenant.databaseUrlEnv} do tenant '${tenant.id}' n\u00e3o est\u00e1 definida.`);
  return url;
}

function evictLeastRecentlyUsedClient(): void {
  if (clients.size < MAX_CACHED_TENANT_CLIENTS) return;
  const oldest = [...clients.entries()].sort(([, a], [, b]) => a.lastUsedAt - b.lastUsedAt)[0];
  if (!oldest) return;

  const [tenantId, cached] = oldest;
  clients.delete(tenantId);
  void cached.client.$disconnect();
}

export function getPrismaForTenant(tenant: TenantConfig): PrismaClient {
  const cached = clients.get(tenant.id);
  if (cached) {
    cached.lastUsedAt = Date.now();
    return cached.client;
  }

  evictLeastRecentlyUsedClient();
  const client = new PrismaClient({
    datasources: { db: { url: getDatabaseUrl(tenant) } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  clients.set(tenant.id, { client, lastUsedAt: Date.now() });
  return client;
}

export async function getCurrentPrisma(): Promise<PrismaClient> {
  return getPrismaForTenant(await getCurrentTenant());
}

/*
 * Compatibility facade for the existing services. Each database operation
 * resolves the current request tenant, so a connection cannot leak from one
 * hostname into another request.
 */
const delegateCache = new Map<string, object>();

function getDelegate(delegateName: string): object {
  const cached = delegateCache.get(delegateName);
  if (cached) return cached;

  const delegate = new Proxy({}, {
    get(_target, property) {
      if (typeof property !== "string") return undefined;
      return async (...args: unknown[]) => {
        const client = await getCurrentPrisma();
        const delegateObject = (client as unknown as Record<string, Record<string, (...values: unknown[]) => unknown>>)[delegateName];
        const method = delegateObject?.[property];
        if (typeof method !== "function") throw new Error(`Delegate Prisma '${delegateName}.${property}' n\u00e3o existe.`);
        return method.apply(delegateObject, args);
      };
    },
  });

  delegateCache.set(delegateName, delegate);
  return delegate;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    if (property === "then" || typeof property !== "string") return undefined;

    if (property.startsWith("$")) {
      return async (...args: unknown[]) => {
        const client = await getCurrentPrisma();
        const method = (client as unknown as Record<string, (...values: unknown[]) => unknown>)[property];
        if (typeof method !== "function") throw new Error(`M\u00e9todo Prisma '${property}' n\u00e3o existe.`);
        return method.apply(client, args);
      };
    }

    return getDelegate(property);
  },
});
