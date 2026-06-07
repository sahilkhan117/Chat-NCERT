import { Hono } from "hono";
import { cors } from "hono/cors";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema";
import ragRouter from "./routes/rag";
import billingRouter from "./routes/billing";
import { authMiddleware } from "./middleware/auth";
import { validateApiEnv } from "@chat-ncert/config";
import { setConnectionString } from "@chat-ncert/db";

type Bindings = {
  NCERT_BUCKET: R2Bucket;
  DATABASE_URL: string;
  GEMINI_API_KEY: string;
  UPSTASH_REDIS_URL: string;
  UPSTASH_REDIS_TOKEN: string;
  UPSTASH_QSTASH_TOKEN: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS globally
app.use("*", cors());

// Global Logger and Environment Validation Middleware
app.use("*", async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  try {
    validateApiEnv({
      DATABASE_URL: c.env.DATABASE_URL,
      GEMINI_API_KEY: c.env.GEMINI_API_KEY,
      UPSTASH_REDIS_URL: c.env.UPSTASH_REDIS_URL,
      UPSTASH_REDIS_TOKEN: c.env.UPSTASH_REDIS_TOKEN,
      UPSTASH_QSTASH_TOKEN: c.env.UPSTASH_QSTASH_TOKEN,
      JWT_SECRET: c.env.JWT_SECRET,
    });
    setConnectionString(c.env.DATABASE_URL);
  } catch (err: any) {
    return c.json(
      {
        error: {
          code: "CONFIGURATION_ERROR",
          message: `Worker Configuration Error: ${err.message}`,
        },
      },
      500,
    );
  }
  return await next();
});

// REST Health Check
app.get("/api/v1/health", (c) => {
  return c.json({ status: "ok", time: new Date().toISOString() });
});

// Mount REST Routers
app.route("/api/v1/rag", ragRouter);
app.route("/api/v1/billing", billingRouter);

// Initialize GraphQL Yoga Server
const yoga = createYoga({
  schema,
  landingPage: true, // Enables the GraphiQL playground UI
});

// Authenticate GraphQL queries/mutations
app.use("/graphql", authMiddleware);

app.all("/graphql", (c) => {
  // Retrieve Hono authentication context
  const auth = c.get("auth");

  // Run Yoga server passing Hono context as the GraphQL Yoga execution context
  return yoga.handle({
    request: c.req.raw,
    auth,
  } as any);
});

export default app;
