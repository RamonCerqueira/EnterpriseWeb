import { cookies } from "next/headers";

export interface SessionData {
  id: number;
  nome: string;
  usuario: string;
  role: string;
  permissions: Record<string, boolean>;
}

const SESSION_COOKIE_NAME = "softline_session";

export async function setSession(data: SessionData) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours session
  
  // Simple base64 encoding for mock/demo session.
  // In production, encrypt using jose or iron-session.
  const serialized = Buffer.from(JSON.stringify(data)).toString("base64");
  
  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie) return null;
  
  try {
    const raw = Buffer.from(cookie.value, "base64").toString("utf-8");
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Permission checking helper
export function hasPermission(session: SessionData | null, opKey: string): boolean {
  if (!session) return false;
  
  // Administrator bypass (Op91 is the Administrator role permission)
  if (session.role === "Administrador" || session.permissions["Op91"]) {
    return true;
  }
  
  return !!session.permissions[opKey];
}
