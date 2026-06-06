# Chat-NCERT — High-Level Design Document

**Version:** 1.1  
**Author:** Sahil Khan  
**Date:** June 2026  
**Status:** Planning

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [System Architecture](#3-system-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Infrastructure and Deployment](#5-infrastructure-and-deployment)
6. [Multi-Tenancy Design](#6-multi-tenancy-design)
7. [Authentication and RBAC](#7-authentication-and-rbac)
8. [Core Services](#8-core-services)
9. [AI and RAG Pipeline](#9-ai-and-rag-pipeline)
10. [Billing and SaaS Model](#10-billing-and-saas-model)
11. [Data Layer](#11-data-layer)
12. [Zero-Cost Service Map](#12-zero-cost-service-map)
13. [Key Design Decisions](#13-key-design-decisions)
14. [Out of Scope for v1](#14-out-of-scope-for-v1)
15. [Monorepo Structure](#15-monorepo-structure)
16. [Error Handling & Observability](#16-error-handling--observability)

---

## 1. Project Overview

Chat-NCERT is a **multi-tenant SaaS EdTech platform** designed to be white-labeled by educational institutions and EdTech companies on top of their existing course offerings. It provides AI-driven academic assistance, community learning, quizzes, and assignment workflows — all accessible via a per-tenant API key model.

The platform is built to be **interview-defensible and portfolio-grade**: every architectural decision has a documented rationale, every metric is defensible, and the entire system runs at **₹0/month** on permanent free tiers.

### Core Value Proposition

> EdTech companies embed Chat-NCERT into their platforms via API. Their students get AI-powered NCERT Q&A, community groups, AI-generated quizzes, and assignment workflows — without the institution building any of this themselves.

---

## 2. Goals and Non-Goals

### Goals

- Multi-tenant SaaS with per-tenant API key access and billing
- RAG-based NCERT Q&A using Gemini 2.5 Flash (cloud) and Qwen-3.5 via Ollama (private, tenant-hosted)
- Community learning groups and social feed per tenant
- AI-generated quizzes and automated testing
- Assignment submission and workflow management
- Role hierarchy: Super Admin → Tenant Admin → Instructor → Student
- Zero infrastructure cost for demonstration and development
- Full documentation suitable for Notion upload and GitHub

### Non-Goals (v1)

- Native mobile app (responsive web only)
- Real-time video/audio (no WebRTC)
- Custom LLM fine-tuning per tenant
- Marketplace for third-party plugins
- Live proctoring for exams

---

## 3. System Architecture

The architecture is organized into five horizontal layers:

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTS                            │
│  Web App │ Admin Portal │ Landing/Pricing │ Ollama Cfg  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│               CLOUDFLARE EDGE                           │
│  Pages (SSR) │ Workers (Hono API) │ R2 │ CDN            │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    SERVICES                             │
│  RAG │ Auth │ Community │ Billing │ Quiz │ Assignments  │
│               Notifications │ Tenant Manager           │
└────────────────────────┬────────────────────────────────┘
                         │ SQL / ORM (Drizzle)
┌────────────────────────▼────────────────────────────────┐
│                   SUPABASE POSTGRES                     │
│    + pgvector & JSONB (Relational + Document Data)      │
│    Users, tenants, billing, vectors, posts, quizzes     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   AI / INFRA                            │
│  gemini-2.5-flash │ Qwen-3.5 (Ollama Tunnel)            │
└─────────────────────────────────────────────────────────┘
```

### Request Lifecycle (Hybrid API Gateway)

1. Client sends HTTPS request to Cloudflare edge
2. Cloudflare Workers runs the Hono gateway
3. Hono middleware validates JWT, resolves `tenant_id`, enforces rate limits
4. Request is routed based on type:
   - **REST (`/api/v1/*`):** Auth, RAG Q&A, File Ingestion, Billing Webhooks
   - **GraphQL (`/graphql`):** Community Feed, Dashboards, Quiz Analytics
5. For GraphQL, `tenant_id` is injected into the Yoga Context; for REST, it's passed via Hono Context
6. Services read/write to Supabase (utilizing JSONB for community posts, quizzes, and assignment configurations)
7. Heavy async work (PDF ingestion, quiz generation) is dispatched to Upstash QStash
8. AI calls route to gemini-2.5-flash (cloud) or the tenant's public Ollama tunnel (private)
9. Response returns through Workers to the client

---

## 4. Tech Stack

### Frontend

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR for SEO on landing/pricing pages; RSC reduces client JS bundle |
| Styling | Tailwind CSS + Shadcn-UI | Consistent design system, zero runtime CSS |
| State | Zustand | Lightweight, no boilerplate vs Redux |
| Forms | React Hook Form + Zod | Type-safe validation end-to-end |

### Backend (Hybrid API)

| Layer | Technology | Rationale |
|---|---|---|
| Runtime | Bun | 3–5× faster startup than Node; native TypeScript; CF Workers compatible |
| API Framework | Hono | Built for CF Workers; 20× faster than Express in benchmarks; tiny core |
| GraphQL | GraphQL Yoga | Edge-compatible GraphQL server; runs perfectly inside Hono |
| ORM | Drizzle ORM | SQL-first, full TypeScript inference; raw SQL control vs Prisma abstraction |
| DB Driver | postgres.js | Faster than `pg` on Bun; HTTP-compatible with CF Workers via Supabase pooler |
| Validation | Zod | Schema validation on all API inputs; shared with frontend for DRY types |
| Auth | Better-Auth | Tenant-aware RBAC out of the box; modern alternative to NextAuth v5 |
| Queue | Upstash QStash | HTTP-based queue — works inside CF Workers (no persistent TCP) |
| Cache | Upstash Redis | HTTP Redis — same reason; sessions, rate limiting, response cache |
| Email | Resend | Clean SDK, generous free tier, better DX than Nodemailer |
| API Docs | @hono/zod-openapi + Scalar | Auto-generates OpenAPI 3.1 docs from REST route schemas |

### AI and RAG

| Component | Technology | Rationale |
|---|---|---|
| Cloud LLM | Gemini 2.5 Flash | High-reasoning tasks; 1500 req/day free on Google AI Studio |
| Private LLM | Qwen-3.5 via Ollama | Tenant-hosted; zero cost; data never leaves tenant machine |
| RAG Orchestration | LlamaIndex (TS) | Best TypeScript support for document loaders, chunking, retrieval |
| Vector Storage | pgvector on Supabase | Colocates embeddings with relational data; no separate vector DB dependency |
| Embeddings | Gemini `text-embedding-004` | Free tier; high quality; consistent with LLM provider |

### Testing and Tooling

| Tool | Purpose |
|---|---|
| Vitest | Unit + integration tests; Bun-compatible; Jest-compatible API |
| Biome | Replaces ESLint + Prettier in one fast tool |
| Wrangler | CF Workers/Pages CLI for local dev and deployment |
| GitHub Actions | CI/CD pipeline; 2000 min/month free |
| Sentry | Error tracking; 5k errors/month free |

---

## 5. Infrastructure and Deployment

### Cloudflare (Primary Edge)

| Service | Usage | Free Tier |
|---|---|---|
| Cloudflare Pages | Next.js frontend deploy | Unlimited sites, 500 builds/month |
| Cloudflare Workers | Hono API, edge runtime | 100k requests/day |
| Cloudflare R2 | NCERT PDFs, file uploads | 10GB storage, 1M ops/month |
| Cloudflare CDN + DNS | Static asset caching, custom domain | Free forever |
| Cloudflare Queues | Async job dispatch | 1M messages/month |

### External Free Tiers

| Service | Usage | Free Tier |
|---|---|---|
| Supabase | PostgreSQL, pgvector & JSONB | 500MB, never pauses |
| Upstash Redis | Sessions, cache, rate limits | 10k commands/day |
| Upstash QStash | Cron jobs, scheduled tasks | 500 messages/day |
| Resend | Transactional email | 3k emails/month |
| Google AI Studio | gemini-2.5-flash API | 1500 requests/day |
| Ollama (tenant) | Qwen-3.5 private inference | Tunnel to local machine |
| GitHub Actions | CI/CD | 2000 min/month |
| Sentry | Error monitoring | 5k errors/month |

**Total monthly infrastructure cost: ₹0**

### Deployment Pipeline

```
git push main
     │
     ▼
GitHub Actions (lint → test → build)
     │
     ├── Wrangler deploy → Cloudflare Workers (Hono API)
     └── Cloudflare Pages → Next.js frontend (auto-detected)
```

### Keeping Free Tiers Alive

Supabase pauses databases after 7 days of inactivity. A QStash cron job pings the Supabase health endpoint every 4 days automatically.

---

## 6. Multi-Tenancy Design

### Strategy: Row-Level Tenant Isolation

Every table in PostgreSQL carries a `tenant_id` UUID column. All queries are scoped by `tenant_id` at the ORM layer via a Drizzle middleware that injects the filter automatically based on the resolved tenant from the JWT.

```
Rationale: Schema-per-tenant gives stronger isolation but requires
N database connections and complex migration management.
Row-level isolation with proper RLS policies in Postgres gives
95% of the isolation at 20% of the operational complexity.
At v1 SaaS scale this is the correct tradeoff.
```

### Tenant Onboarding Flow

1. EdTech company registers on the landing page
2. Super Admin approves and provisions a new tenant record
3. System generates a `tenant_id` UUID and an API key (`sk_live_...`)
4. Tenant Admin configures: domain, branding, Ollama endpoint (optional), plan tier
5. Tenant receives API key and embeds Chat-NCERT into their platform via the SDK

### API Key Authentication

All tenant-to-tenant API requests use bearer token authentication:

```
Authorization: Bearer sk_live_<tenant_api_key>
```

The Hono gateway resolves `tenant_id` from the API key on every request, injects it into the request context, and all downstream services use it without needing to pass it explicitly.

---

## 7. Authentication and RBAC

### Role Hierarchy

```
Super Admin
  └── Tenant Admin (one per institution)
        ├── Instructor (creates courses, quizzes, assignments)
        └── Student (consumes content, submits work)
```

### Role Permissions Matrix

| Action | Super Admin | Tenant Admin | Instructor | Student |
|---|:---:|:---:|:---:|:---:|
| Create/delete tenants | ✓ | — | — | — |
| Manage tenant settings | ✓ | ✓ | — | — |
| Upload NCERT PDFs | ✓ | ✓ | ✓ | — |
| Create quizzes | ✓ | ✓ | ✓ | — |
| Create assignments | ✓ | ✓ | ✓ | — |
| Submit assignments | — | — | — | ✓ |
| Ask RAG questions | ✓ | ✓ | ✓ | ✓ |
| View analytics | ✓ | ✓ | ✓ | — |
| Manage billing | ✓ | ✓ | — | — |

### JWT Structure

```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "role": "instructor",
  "plan": "pro",
  "iat": 1700000000,
  "exp": 1700086400
}
```

Better-Auth handles token issuance, refresh, and invalidation. Session data is cached in Upstash Redis keyed by `session_id` for fast validation without hitting the database on every request.

---

## 8. Core Services

### RAG Service
Handles NCERT PDF ingestion and Q&A. PDFs are uploaded to R2, a QStash job triggers ingestion: LlamaIndex loads the PDF, chunks it into 512-token segments with 50-token overlap, generates embeddings via Gemini `text-embedding-004`, and stores vectors in pgvector. At query time, the user question is embedded, top-k chunks are retrieved via cosine similarity, and Gemini 2.5 Flash generates the answer with the retrieved context.

### Auth Service
Built on Better-Auth. Handles registration, login, JWT issuance, refresh token rotation, and session management. All sessions are tenant-scoped. Supports email/password and magic link flows. Session store is Upstash Redis with a 24h TTL.

### Community Service
Groups and social feed per tenant. Students can join groups, post content, comment, and react. Data is stored in Supabase using relational tables with nested replies/metadata configured via JSONB. Feed uses a simple reverse-chronological sort with group membership filtering.

### Quiz Engine
Instructors can trigger AI-generated quizzes from any uploaded content. A QStash job sends the content chunks to Gemini with a structured prompt, which returns a JSON array of questions, options, and correct answers. Quizzes are stored in the Supabase database. Student attempts are tracked with score, time taken, and per-question analytics stored in JSONB columns.

### Assignment Service
Instructors create assignments with due dates, rubrics, and file attachment support. Students submit via file upload to R2 or text entry. Submissions are stored in Supabase. Status machine: `draft → submitted → under_review → graded`.

### Notification Service
Dispatches email (via Resend) and in-app notifications. Triggered by events: assignment due soon, quiz published, grade released, new community post. In-app notifications are stored in Supabase and delivered via polling (SSE upgrade planned for v2).

### Billing Service
Razorpay for Indian market; Stripe interface stubbed behind a `PaymentProvider` abstraction. Subscription plans stored in PostgreSQL. Webhooks update plan status on payment events. Usage limits (API calls, storage, seats) enforced at the Hono middleware layer based on the plan tier in the JWT.

### Tenant Manager
Handles tenant provisioning, API key rotation, usage tracking, and limit enforcement. Super Admin dashboard shows all tenants, their plan tiers, usage metrics, and billing status.

---

## 9. AI and RAG Pipeline

### Ingestion Pipeline

```
PDF upload (R2)
      │
      ▼
QStash job triggered
      │
      ▼
LlamaIndex PDF loader
      │
      ▼
Chunking: 512 tokens, 50 overlap, semantic boundaries
      │
      ▼
Gemini text-embedding-004 (batch)
      │
      ▼
pgvector upsert (tenant_id scoped)
      │
      ▼
Ingestion complete → notify instructor
```

### Query Pipeline

```
Student question
      │
      ▼
Embed question (Gemini text-embedding-004)
      │
      ▼
pgvector cosine similarity search (top-5, tenant_id filter)
      │
      ▼
Route decision:
  ├── Tenant has Ollama endpoint? → Qwen-3.5 (private)
  └── No endpoint configured?    → Gemini 2.5 Flash (cloud)
      │
      ▼
LLM generates answer with retrieved context
      │
      ▼
Response + source citations returned to student
```

### Model Routing Logic

```typescript
async function routeToLLM(tenantId: string, prompt: string, context: string[]) {
  const tenant = await getTenant(tenantId);
  if (tenant.ollamaTunnelUrl) {
    return callOllama(tenant.ollamaTunnelUrl, prompt, context);
  }
  return callGemini(prompt, context);
}
```

This gives tenants who want data privacy (schools, government institutions) the option to route calls to their local Ollama instance via a public HTTPS tunnel (e.g., Cloudflare Tunnel).

---

## 10. Billing and SaaS Model

### Plan Tiers

| Feature | Free | Starter | Pro |
|---|---|---|---|
| Students | 50 | 500 | Unlimited |
| RAG queries/month | 100 | 5,000 | Unlimited |
| Storage (R2) | 500MB | 5GB | 50GB |
| Custom Ollama endpoint | — | ✓ | ✓ |
| Analytics dashboard | Basic | Full | Full |
| API access | — | ✓ | ✓ |
| Price | ₹0 | ₹999/month | ₹4,999/month |

### Payment Provider Abstraction

```typescript
interface PaymentProvider {
  createSubscription(tenantId: string, plan: Plan): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  handleWebhook(payload: unknown): Promise<void>;
}

class RazorpayProvider implements PaymentProvider { ... }
class StripeProvider implements PaymentProvider { ... }  // stub
```

Swapping payment providers is a single configuration change, not a code change.

---

## 11. Data Layer

### Supabase PostgreSQL (Drizzle)

Stores all relational, transactional, vector, and document data (using JSONB):

- `tenants` — tenant registry, API keys, plan tier, Ollama tunnel URL
- `users` — accounts scoped to `tenant_id`
- `roles` — RBAC role assignments
- `sessions` — auth session records
- `subscriptions` — billing subscriptions and payment history
- `documents` — NCERT PDF metadata (content in R2, vectors in pgvector)
- `embeddings` — pgvector table for semantic search
- `posts` — community feed posts, comments, reactions (nested comments structured in JSONB)
- `quizzes` — quiz definitions and questions (JSONB list)
- `quiz_attempts` — student attempt records and analytics (JSONB)
- `assignments` — assignment definitions, rubrics, and student submissions

All tables carry `tenant_id`, `created_at`, `updated_at`. Drizzle schema is the single source of truth; migrations run via `drizzle-kit`.

### Upstash Redis

- Session tokens (TTL: 24h)
- Rate limit counters (sliding window, per tenant per route)
- Response cache for frequent RAG queries (TTL: 1h)
- Real-time notification counters

---

## 12. Zero-Cost Service Map

```
╔══════════════════════════════════════════╗
║         CLOUDFLARE (free forever)        ║
║                                          ║
║  ┌─────────┐  ┌──────────┐  ┌────────┐  ║
║  │  Pages  │  │ Workers  │  │   R2   │  ║
║  │ Next.js │  │  Hono    │  │ Files  │  ║
║  └─────────┘  └──────────┘  └────────┘  ║
║                                          ║
║  ┌─────────────────────┐                 ║
║  │    CDN + DNS        │                 ║
║  └─────────────────────┘                 ║
╚══════════════════════════════════════════╝

╔══════════════════════════════════════════╗
║        EXTERNAL FREE TIERS              ║
║                                          ║
║  Supabase       MongoDB Atlas            ║
║  Postgres+vec   Documents                ║
║                                          ║
║  Upstash Redis  Upstash QStash           ║
║  Cache/sessions Cron/async jobs          ║
║                                          ║
║  Resend         Google AI Studio         ║
║  Email          Gemini 2.5 Flash         ║
╚══════════════════════════════════════════╝

AI:  Gemini 2.5 Flash (1500 req/day) + Qwen-3.5 via Ollama (free, local)
CI:  GitHub Actions (2000 min/month)
Mon: Sentry (5k errors/month)
```

---

## 13. Key Design Decisions

### Why a Hybrid API (GraphQL + REST)?

We use a **Hybrid API Gateway** running on Hono. 
- **GraphQL** handles the community feed and dashboards. These features suffer from over-fetching/under-fetching because different clients (admin portal vs mobile web) need different shapes of deeply nested relational data.
- **REST** handles auth, file ingestion, RAG streaming, and billing webhooks. These operations are action-oriented or involve `multipart/form-data` and webhooks, which fight against GraphQL's typed schema.
Both APIs live in the same Cloudflare Worker behind the same JWT middleware — one gateway, two paradigms, each used where it outperforms the other.

### Why Hono over Express?

Hono was built specifically for Cloudflare Workers and edge runtimes. It is 20× faster than Express in benchmarks on Workers, and its middleware API is nearly identical. The migration path from Express is minimal; the performance and edge-compatibility gains are significant. *"Express on Node was the baseline — Hono on Bun gave measurable throughput gains without changing developer ergonomics."*

### Why Drizzle over Prisma?

Prisma abstracts SQL too heavily — the generated queries are not always optimal and the runtime overhead is significant. Drizzle is SQL-first: the schema is TypeScript, the queries look like SQL, and there is no hidden magic. For a system where we need precise control over pgvector queries and multi-tenant filtering, Drizzle is the right tool.

### Why pgvector instead of a standalone vector DB?

At v1 scale (< 1M vectors per tenant), pgvector on Supabase outperforms a standalone Pinecone at a fraction of the cost and operational complexity. Colocating vectors with relational data means joins are free — we can filter by `tenant_id`, `subject`, `class` in the same query as the vector similarity search. No separate infrastructure, no sync complexity.

### Why row-level tenancy over schema-per-tenant?

Schema-per-tenant gives maximum isolation but requires N database connections, N migration runs, and significant operational complexity. Row-level tenancy with Postgres RLS policies gives 95% of the isolation guarantee at 20% of the operational cost. At SaaS v1 scale this is the correct tradeoff. The architecture is documented so schema-per-tenant can be migrated to if isolation requirements increase.

### Why Upstash over a self-hosted Redis?

Cloudflare Workers cannot maintain persistent TCP connections. Upstash Redis uses HTTP, which works natively inside Workers. This eliminates the need for a separate always-on Redis instance. Upstash QStash replaces BullMQ for the same reason — HTTP-based, no persistent connection required.

### Why Razorpay + Stripe stub?

Razorpay covers the Indian market with test mode requiring no live bank account — suitable for development and demonstration. The `PaymentProvider` interface means Stripe is a config swap, not a rewrite. This is an architecturally mature decision: *"The billing interface is abstracted so Stripe is a configuration change, not a code change."*

---

## 14. Out of Scope for v1

| Feature | Reason deferred |
|---|---|
| Native mobile app | Web is sufficient for portfolio demonstration |
| Real-time feed (WebSockets) | SSE polling adequate for v1; WebSockets require persistent connections (CF Workers limitation) |
| Custom LLM fine-tuning | Significant cost and compute; out of free tier |
| Multi-region Postgres | Supabase free tier is single region |
| Proctoring / anti-cheat | Scope too large; separate product consideration |
| Marketplace / plugin system | Requires stable public API first |
| Stripe live integration | Requires verified business entity; stubbed for now |

---

## 15. Monorepo Structure

The project uses Bun Workspaces to manage the monorepo structure. This allows sharing TypeScript types and Drizzle schemas seamlessly between the frontend and edge worker.

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

---

## 16. Error Handling & Observability

- **Structured Logging:** Middleware intercepts requests/responses and logs JSON to the Cloudflare Workers console (trace ID, tenant ID, latency, status code).
- **Standardized Error Responses:**
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "You have exceeded your plan limits.",
      "requestId": "req_1234abc"
    }
  }
  ```
- **Error Tracking:** Sentry is integrated at the top-level Hono error handler to catch unhandled promise rejections and database failures, grouped by `tenant_id`.

---

## Appendix: Interview Talking Points

**"Why this stack?"**
Every choice has a tradeoff story: Hono over Express (edge perf), Drizzle over Prisma (SQL control), pgvector over Pinecone (colocation, cost), row-level tenancy over schema-per-tenant (operational simplicity), Upstash over Redis (CF Workers HTTP constraint).

**"How does it scale?"**
CF Workers auto-scale to millions of requests with no config. Supabase scales vertically with a plan upgrade. MongoDB Atlas scales horizontally. The architecture is designed so each service upgrades independently — no code changes, only configuration.

**"How do you handle tenant data isolation?"**
Row-level `tenant_id` enforced at the ORM middleware layer — no query can execute without a `tenant_id` filter. Postgres RLS policies provide a second enforcement layer at the database level.

**"What would you change at production scale?"**
Schema-per-tenant for stronger isolation, dedicated Redis instance (Upstash paid or self-hosted), Stripe live integration, WebSocket upgrade for real-time feed, CDN-level caching for RAG responses.

---

*Document maintained alongside the codebase at `docs/HLD.md`*  
*Last updated: June 2026*