import type { Context, Next } from "hono";

export interface AuthContext {
  tenantId: string;
  userId?: string;
  role?: string;
}

declare module "hono" {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Missing Authorization header",
        },
      },
      401,
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");

  // 1. Programmatic API Key Authentication (e.g., sk_live_...)
  if (token.startsWith("sk_live_")) {
    // In a real implementation:
    // const [tenant] = await db.select().from(tenants).where(eq(tenants.apiKey, token)).limit(1);
    // if (!tenant) return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid API Key' } }, 401);
    c.set("auth", {
      tenantId: "mock-tenant-uuid-api-key",
      role: "tenant_admin",
    });
    return await next();
  }

  // 2. Session Token / JWT Authentication (Better-Auth)
  try {
    // In real implementation:
    // const session = await auth.api.getSession({ headers: c.req.raw.headers });
    // if (!session) return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid session' } }, 401);
    // c.set('auth', { tenantId: session.user.tenantId, userId: session.user.id, role: session.user.role });
    c.set("auth", {
      tenantId: "mock-tenant-uuid-session",
      userId: "mock-user-uuid-session",
      role: "student",
    });
    return await next();
  } catch (err) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or expired authorization session",
        },
      },
      401,
    );
  }
}
