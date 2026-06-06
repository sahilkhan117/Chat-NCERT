# Chat-NCERT: Finalized Execution Plan

This document outlines the finalized step-by-step implementation plan for Chat-NCERT. It incorporates the Hybrid API architecture, Bun monorepo structure, and the automated CI/CD deployment pipeline using GitHub Actions, Wrangler, Cloudflare (Pages + Workers), and Supabase.

## 1. Monorepo & Environment Initialization
*   **Action:** Initialize a Bun workspace to manage the monolithic structure.
*   **Structure:**
    ```text
    chat-ncert/
    ├── apps/
    │   ├── web/          # Next.js 15 App Router (Frontend)
    │   └── api/          # Hono (Cloudflare Workers API Gateway)
    ├── packages/
    │   ├── db/           # Drizzle schema, migrations, connection pool
    │   ├── types/        # Shared Zod schemas and TypeScript interfaces
    │   └── config/       # Shared TSConfig, Biome configuration
    ├── package.json      # Workspace root
    └── bun.lockb         # Fast lockfile
    ```

## 2. Database & Data Layer Setup
*   **Action:** Set up the Supabase PostgreSQL database and Drizzle ORM.
*   **Details:**
    *   Initialize `packages/db/schema.ts` defining `tenants` (with `ollama_tunnel_url`), `users`, `sessions`, `documents`, embeddings (via `pgvector`), and tables for `posts` (with JSONB for nested comments/reactions), `quizzes`, `quiz_attempts`, and `assignments` (utilizing JSONB for flexible rubrics and questions).
    *   Configure `drizzle.config.ts` for running migrations securely against the Supabase connection pooler.

## 3. Backend Implementation (Cloudflare Workers + Hono)
*   **Action:** Build the Hybrid API Gateway running on Cloudflare Workers.
*   **Details:**
    *   **REST (`/api/v1/*`):** Endpoints for file ingestion, RAG streaming, Auth (via Better-Auth), and billing webhooks.
    *   **GraphQL (`/graphql`):** `graphql-yoga` setup for Community Feed and Dashboards.
    *   **Middleware:** Implement JWT validation that resolves `tenant_id` and passes it to both REST contexts and GraphQL contexts.
    *   **Config:** Setup `apps/api/wrangler.toml` binding Cloudflare R2, KV, and environment variables.

## 4. Frontend Implementation (Next.js 15)
*   **Action:** Setup the frontend with Tailwind CSS and shadcn-ui.
*   **Details:**
    *   Implement SSR landing pages for SEO.
    *   Configure Apollo Client for GraphQL queries and standard `fetch` for REST mutations/uploads.
    *   Setup `apps/web/wrangler.toml` for Cloudflare Pages deployment.

## 5. CI/CD Pipeline (GitHub Actions + Wrangler)
*   **Action:** Automate linting, testing, and edge deployments.
*   **Details (.github/workflows/deploy.yml):**
    1.  **Trigger:** Push to `main`.
    2.  **Environment:** Setup Bun environment on the runner.
    3.  **Checks:** Run `biome check` and `vitest` across all workspaces.
    4.  **Deploy API:** Run `cd apps/api && bunx wrangler deploy --minify` to push the worker.
    5.  **Deploy Web:** Run `cd apps/web && bunx @cloudflare/next-on-pages && bunx wrangler pages deploy .vercel/output/static` to push the Next.js app to Cloudflare Pages.

---

## 🛡️ Interview Defense: CI/CD & Deployment Architecture

If asked to defend this deployment structure during your TCS Prime interview, use the following points:

### Q: Why use GitHub Actions + Wrangler instead of Vercel or standard Docker containers?
**Answer:**
"Using Vercel for Next.js is easy, but it locks you into their pricing model and infrastructure. By using Cloudflare Pages for the frontend and Cloudflare Workers for the API, I keep the entire application on a unified edge network with zero bandwidth egress costs.
I used GitHub Actions because it gives me full control over the pipeline. Using `wrangler` (Cloudflare's CLI) inside the Action allows me to deploy both the frontend (`next-on-pages`) and the backend (`wrangler deploy`) in a single orchestrated workflow. Docker containers would require managing a VPS, Kubernetes, or ECS, which introduces cold starts and maintenance overhead that serverless edge computing completely eliminates."

### Q: How do you handle database migrations in a serverless CI/CD pipeline?
**Answer:**
"Cloudflare Workers cannot establish persistent TCP connections to standard databases, which is why I use Supabase. Supabase provides a built-in PgBouncer connection pooler that exposes an HTTP-compatible connection string.
During the CI/CD pipeline, before `wrangler deploy` executes, I run a GitHub Action step `bunx drizzle-kit push` using that connection pooler URL. This ensures the database schema is always in sync with the code being deployed to the Edge, without risking connection timeouts in the runner."

### Q: Why separate the frontend and backend deployments in the monorepo instead of deploying Next.js API routes?
**Answer:**
"Next.js API routes are great, but they couple the backend deeply to the Next.js framework. By separating the API into a dedicated Hono Cloudflare Worker (`apps/api`), I achieved three things:
1.  **Independent Scaling:** If the API gets hit heavily by programmatic webhook traffic, it scales independently of the frontend rendering logic.
2.  **Performance:** Hono on Bun/Workers is significantly faster than Next.js serverless functions for raw JSON processing.
3.  **Client Agnosticism:** If we decide to build a native mobile app later, the Hono Hybrid API is already decoupled and ready to serve mobile clients without touching the Next.js repository."
