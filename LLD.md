# Chat-NCERT — Low-Level Design Document

**Version:** 1.1
**Author:** Sahil Khan
**Date:** June 2026
**Status:** Planning

---

## Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [Database Schema (Supabase PostgreSQL + JSONB)](#2-database-schema)
3. [API Design (Hybrid REST + GraphQL)](#3-api-design)
4. [Multi-Tenancy Middleware](#4-multi-tenancy-middleware)
5. [Auth Flow](#5-auth-flow)
6. [RAG Pipeline](#6-rag-pipeline)
7. [Quiz Engine](#7-quiz-engine)
8. [Assignment Workflow](#8-assignment-workflow)
9. [Billing Flow](#9-billing-flow)
10. [Community Feed](#10-community-feed)
11. [Notification System](#11-notification-system)
12. [File Upload Flow](#12-file-upload-flow)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Environment and Config](#14-environment-and-config)

---

## 1. Monorepo Structure

The project is a monorepo managed with **Bun workspaces**. All packages share TypeScript types and Zod schemas from the `packages/` layer.

```text
chat-ncert/
├── apps/
│   ├── web/                     # Next.js 15 — student + admin frontend
│   └── api/                     # Hono on Bun — Cloudflare Workers API Gateway
├── packages/
│   ├── db/                      # Drizzle schema + migrations (Supabase Postgres)
│   ├── types/                   # Shared TypeScript types and Zod schemas
│   └── config/                  # Shared TSConfig, Biome configuration
├── .github/
│   └── workflows/
│       └── deploy.yml           # Unified Bun deployment workflow
├── biome.json                   # Root formatter & linter configuration
└── package.json                 # Monorepo workspaces definition
```

### apps/web internal structure

```text
apps/web/
├── app/
│   ├── (public)/                # Landing, pricing, about — SSR, public
│   │   ├── login/               # Tenant sign-in page
│   │   └── page.tsx             # Public landing
│   ├── super-admin/             # Super admin portal
│   ├── admin/                   # Tenant admin settings
│   ├── instructor/              # Instructor workspace (PDF upload, Quiz builder)
│   └── dashboard/               # Student dashboard (RAG, Feed, Quizzes)
├── components/
│   ├── ui/                      # Shadcn-UI base elements
│   ├── layout/                  # Sidebar, Header layouts
│   └── features/                # ChatBox, FeedCard, QuizRunner, PDFUpload
└── lib/
    ├── apollo-client.ts         # Apollo Client setup for GraphQL requests
    └── auth.ts                  # Better-Auth client helpers
```

### apps/api internal structure

```text
apps/api/
├── src/
│   ├── index.ts                 # Hono entrypoint (routes REST, mounts GraphQL Yoga)
│   ├── middleware/
│   │   └── auth.ts              # JWT & API Key validation
│   ├── routes/
│   │   ├── rag.ts               # Ingestion, webhook, Q&A REST routes
│   │   └── billing.ts           # Subscriptions & Razorpay webhook REST routes
│   ├── graphql/
│   │   └── schema.ts            # GraphQL Yoga schemas & resolvers
│   └── services/
│       └── ragService.ts        # Gemini embedding, LLM calls, Ollama client logic
└── wrangler.toml                # Cloudflare Worker bindings (R2, KV)
```

---

## 2. Database Schema

All relational and document data is consolidated into **Supabase PostgreSQL** using Drizzle ORM. Document data is stored using flexible Postgres `jsonb` columns.

### PostgreSQL (Drizzle — Supabase)

#### tenants
Stores tenant configuration and local LLM endpoints.
*   `id` (uuid PK) — auto-generated
*   `name` (text) — institution name
*   `apiKey` (text unique) — `sk_live_...` API Key
*   `planTier` (text) — free / starter / pro
*   `ollamaTunnelUrl` (text nullable) — Tenant's public HTTPS tunnel to local Ollama
*   `createdAt` (timestamp) — default now
*   `updatedAt` (timestamp) — default now

#### users
*   `id` (uuid PK) — auto-generated
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `email` (text unique) — email key
*   `name` (text)
*   `role` (text) — student / instructor / tenant_admin
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### sessions
*   `id` (text PK) — session identifier
*   `userId` (uuid FK $\rightarrow$ users.id)
*   `token` (text) — JWT token
*   `expiresAt` (timestamp)
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### documents
Metadata of textbooks uploaded to Cloudflare R2.
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `title` (text) — filename
*   `r2Path` (text) — location key in R2
*   `class` (text nullable)
*   `subject` (text nullable)
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### embeddings
Vector mappings of split PDF document text chunks.
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `documentId` (uuid FK $\rightarrow$ documents.id)
*   `content` (text) — raw text chunk
*   `embedding` (vector(768)) — Gemini `text-embedding-004` (768 dimensions)
*   `metadata` (jsonb) — page, chunk index, class, subject
*   `createdAt` (timestamp)

> Index: HNSW vector index on the `embedding` column for fast ANN similarity search.

#### posts
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `authorId` (uuid FK $\rightarrow$ users.id)
*   `title` (text)
*   `content` (text)
*   `comments` (jsonb) — Array of comment structures: `Array<{ id, authorId, content, createdAt }>`
*   `reactions` (jsonb) — Mapping of reactions: `{ thumbsup: Array<userId>, heart: Array<userId> }`
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### quizzes
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `documentId` (uuid FK $\rightarrow$ documents.id, onDelete Set Null)
*   `title` (text)
*   `questions` (jsonb) — Array of questions: `Array<{ id, text, options: string[], answerKeyIndex: number }>`
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### quiz_attempts
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `userId` (uuid FK $\rightarrow$ users.id)
*   `quizId` (uuid FK $\rightarrow$ quizzes.id)
*   `score` (integer) — percentage
*   `timeTaken` (integer) — seconds
*   `answers` (jsonb) — Student choices: `{ questionId: selectedIndex }`
*   `createdAt` (timestamp)

#### assignments
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `title` (text)
*   `description` (text)
*   `dueDate` (timestamp)
*   `rubric` (jsonb) — Grading rubric: `Array<{ criterion, maxPoints }>`
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

#### submissions
*   `id` (uuid PK)
*   `tenantId` (uuid FK $\rightarrow$ tenants.id)
*   `userId` (uuid FK $\rightarrow$ users.id)
*   `assignmentId` (uuid FK $\rightarrow$ assignments.id)
*   `content` (text nullable) — text submission
*   `fileUrl` (text nullable) — R2 path to PDF submission
*   `status` (text) — draft / submitted / graded
*   `grade` (jsonb nullable) — `{ score, feedback, gradedById, gradedAt }`
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

---

## 3. API Design (Hybrid REST + GraphQL)

All API logic is routed inside a single Hono server running on Cloudflare Workers. 

### REST Endpoints (`/api/v1/*`)

REST routes are used for action-oriented, file, and payment webhook integrations.

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register user under a tenant |
| POST | `/api/v1/auth/login` | Public | Authenticate session |
| POST | `/api/v1/rag/ingest` | Instructor | Upload book PDF to R2 & trigger QStash |
| POST | `/api/v1/rag/process-webhook` | QStash | Asynchronously chunk, embed, and store vectors |
| POST | `/api/v1/rag/query` | Student+ | Similarity search (`pgvector`) & query Gemini/Ollama |
| POST | `/api/v1/billing/subscribe` | Admin | Create mock Razorpay payment order |
| POST | `/api/v1/billing/razorpay/webhook`| Razorpay | Process payment & upgrade tenant plan |

### GraphQL Schema (`/graphql`)

Mounted via GraphQL Yoga inside Hono. Used for nested data fetching and feed discussion flows.

#### Queries
*   `posts(limit: Int, offset: Int): [Post!]!` — Get scoped tenant feed
*   `quizzes: [Quiz!]!` — List quizzes
*   `studentDashboard: StudentDashboard!` — Get statistics for logged-in student

#### Mutations
*   `createPost(title: String!, content: String!): Post!`
*   `createComment(postId: ID!, content: String!): Comment!`
*   `submitQuizAttempt(quizId: ID!, answers: JSON!, score: Int!, timeTaken: Int!): QuizAttempt!`

---

## 4. Multi-Tenancy Middleware

Authentication is resolved globally via Hono middlewares and passed down to Hono context variables (`c.get('auth')`) and GraphQL contexts:

```text
Request $\rightarrow$ Hono middleware resolves (API key / JWT session) $\rightarrow$ populate c.set('auth', { tenantId, userId, role })
  ├── REST Route $\rightarrow$ uses c.get('auth')
  └── GraphQL Route $\rightarrow$ yoga.handle(c.req.raw, { auth: c.get('auth') })
```

Rate limiting uses **Upstash Redis** REST counters, checking plans:
*   **Free:** 100 RAG queries/month, 1000 total requests/day.
*   **Starter:** 5000 RAG queries/month, 10000 total requests/day.
*   **Pro:** Unlimited queries, 100000 total requests/day.

---

## 5. Auth Flow

Better-Auth manages tokens.
1.  Access tokens are short-lived (**15 minutes**).
2.  Refresh tokens are long-lived (**7 days**) and stored in httpOnly, Secure cookies.
3.  Verification sessions are cached in Upstash Redis (TTL 24h) to prevent querying Supabase on every single gateway request.

---

## 6. RAG Pipeline

### Ingestion

1.  Instructor POSTs file to `/api/v1/rag/ingest`.
2.  Worker uploads the PDF file directly to Cloudflare R2 bucket (`NCERT_BUCKET`).
3.  Worker dispatches an HTTP message to Upstash QStash, returning `success: true` to the client immediately.
4.  QStash invokes the `/api/v1/rag/process-webhook` worker route asynchronously.
5.  Worker downloads PDF from R2, parses text contents, and chunks it (512 tokens size, 50 tokens overlap).
6.  Worker calls Gemini `text-embedding-004` to generate 768-dimensional embeddings.
7.  Worker inserts vector arrays into Supabase `embeddings` table.

### Query Routing

1.  Student questions are embedded using Gemini `text-embedding-004`.
2.  Cosine similarity search queries pgvector:
    ```sql
    SELECT content, document_id, metadata, (embedding <=> ${questionEmbedding}::vector) as distance
    FROM embeddings
    WHERE tenant_id = ${tenantId}
    ORDER BY distance ASC
    LIMIT 5
    ```
3.  Gateway resolves the tenant settings:
    *   `tenant.ollamaTunnelUrl` is present $\rightarrow$ Routes question + context to local Ollama.
    *   `tenant.ollamaTunnelUrl` is null $\rightarrow$ Routes question + context to Gemini 2.5 Flash.
4.  Results are returned along with citation metadata.

---

## 7. Quiz Engine

1.  Instructor selects a document and clicks "AI Generate Quiz".
2.  API queries the document chunks, sending them to Gemini 2.5 Flash with a structured prompt.
3.  Gemini returns a schema-validated JSON array of questions, option lists, and answer keys.
4.  The generated structure is inserted into the `quizzes` table in Supabase.
5.  Students query quizzes (GraphQL) which filters out the correct answer keys from questions lists to prevent cheating.
6.  Student submits attempt (answers map) $\rightarrow$ Server scores the answers, saves results in `quiz_attempts`, and returns score/feedback.

---

## 8. Assignment Workflow

```text
[draft] $\rightarrow$ Instructor Publishes $\rightarrow$ [published] $\rightarrow$ Student Uploads to R2 $\rightarrow$ [submitted] $\rightarrow$ Graded $\rightarrow$ [graded]
```

To prevent large files hitting serverless Workers, file uploads use a **presigned URL pattern**. The student requests a presigned PUT URL for Cloudflare R2, uploads the PDF directly from the browser to R2, and then completes the submission by posting the R2 file key reference.

---

## 9. Billing Flow

1.  Tenant Admin creates subscription $\rightarrow$ Worker makes mock order with Razorpay SDK.
2.  Admin checks out and completes payment.
3.  Razorpay triggers a webhook to `/api/v1/billing/razorpay/webhook`.
4.  Webhook verifies signatures, extracts custom fields (`tenantId`, `planTier`), and updates the `tenants.planTier` value in Supabase.
5.  Cache is invalidated, updating rate limit thresholds for the tenant instantly.

---

## 10. Community Feed

Discussion boards use GraphQL queries (`posts`) and mutations (`createPost`, `createComment`):
*   Feed comments are nested inside a JSONB column (`posts.comments`). Comment creations append items directly to the Postgres JSONB array.
*   Reactions are toggled on the client and update Postgres JSONB mapping keys atomicially without requiring read-modify-write loops.

---

## 11. Environment and Config

Environment variables are validated on Worker startup using Zod.

**apps/api (wrangler secrets / wrangler.toml)**
*   `GEMINI_API_KEY`: Google AI Studio Key.
*   `DATABASE_URL`: Supabase connection pooler URL (PgBouncer compatible).
*   `UPSTASH_REDIS_URL` & `UPSTASH_REDIS_TOKEN`: For caching & rate limits.
*   `NCERT_BUCKET`: Cloudflare R2 bucket binding.

**apps/web (.env.local)**
*   `NEXT_PUBLIC_API_URL`: Gateway URL.
*   `BETTER_AUTH_SECRET`: Secret to sign web session tokens.