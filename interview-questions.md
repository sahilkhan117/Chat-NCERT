# Chat-NCERT: System Design & Tech Stack Interview Questions

This document prepares you to defend the architectural and tech stack choices for Chat-NCERT. It breaks down the "Why" and "Why Not" for each choice and differentiates them based on **Scale, Performance, Time (Development Speed), and Complexity**.

---

## 1. API Architecture: Hybrid (GraphQL + REST) vs. Pure REST

**Q: Why did you choose a Hybrid API architecture instead of just sticking to REST?**

**Answer:**
A pure REST API is great for actions but leads to severe over-fetching and multiple round-trips for complex, nested data. A pure GraphQL API is great for data fetching but is terrible for file uploads, webhooks, and simple action-oriented mutations.

I chose a **Hybrid API Gateway** running on Hono:
- **GraphQL (via GraphQL Yoga)** is used for the Community Feed and Student Dashboards. The Admin portal needs full metadata for a post, while the mobile web client only needs the title and author. GraphQL solves this over-fetching beautifully and fetches nested comments/reactions in one trip.
- **REST** is used for Authentication, PDF Ingestion (file uploads), RAG Streaming, and Billing Webhooks. `multipart/form-data` and server-sent events (streaming) fight against GraphQL's typed schema.

**Differentiation:**
- **Scale:** GraphQL scales well for varying client data needs without writing custom endpoints for every view. REST scales well for high-throughput, cacheable actions.
- **Performance:** GraphQL reduces network latency by minimizing round-trips, but requires careful handling (DataLoader) to avoid N+1 database queries. REST is naturally faster for simple point-to-point actions.
- **Time/Complexity:** Hybrid adds initial complexity because you maintain two API paradigms. However, it saves time in the long run by not forcing GraphQL to do things it's bad at (like file uploads).

---

## 2. Web Framework: Next.js 15 (App Router) vs. React SPA (Vite)

**Q: Why use Next.js 15 instead of a standard React SPA built with Vite?**

**Answer:**
Chat-NCERT requires SEO for its public landing and pricing pages, which an SPA cannot provide effectively. Additionally, Next.js React Server Components (RSC) allow us to fetch data directly on the server, drastically reducing the JavaScript bundle size shipped to the client.

**Differentiation:**
- **Scale:** Next.js scales exceptionally well on Cloudflare Pages or Vercel edge networks via static site generation (SSG) and edge rendering.
- **Performance:** RSCs provide near-instant initial page loads compared to a Vite SPA, which shows a blank screen until the JS parses and fetches data.
- **Complexity:** Next.js App Router has a steeper learning curve (client vs. server components) compared to Vite, but the built-in routing, API routes, and SSR capabilities eliminate the need for third-party routing and data-fetching libraries.

---

## 3. Runtime & API Framework: Bun + Hono vs. Node.js + Express

**Q: Node.js and Express are industry standards. Why use Bun and Hono?**

**Answer:**
Express was the baseline, but it was not built for Edge runtimes (like Cloudflare Workers). Hono is designed specifically for Edge and serverless environments. It uses web-standard Request/Response APIs and is up to 20x faster than Express in benchmarks. Bun is used as the local runtime because its startup time is 3-5x faster than Node, and it has native TypeScript support out of the box.

**Differentiation:**
- **Performance:** Hono on Cloudflare Workers yields cold starts under 10ms. Express on Node.js often sees cold starts of 200-500ms in serverless environments.
- **Scale:** Cloudflare Workers can handle millions of requests globally with zero scaling configuration. Traditional Node/Express requires container orchestration (K8s/ECS) and auto-scaling rules.
- **Time/Complexity:** Hono's API is intentionally designed to look like Express, so the developer learning curve is near zero. Bun eliminates the need for `ts-node` or complex build steps, saving development time.

---

## 4. Database ORM: Drizzle vs. Prisma

**Q: Prisma has a massive ecosystem and great developer experience. Why Drizzle?**

**Answer:**
Prisma abstracts SQL too heavily. It uses a Rust-based query engine under the hood, which adds runtime overhead and historically struggled in Edge environments without data proxies. Drizzle is SQL-first: the TypeScript schema mirrors the database exactly, and the queries look like standard SQL. 

Because Chat-NCERT relies heavily on **pgvector** for semantic search and row-level tenancy (`tenant_id` filtering on every query), I needed precise control over the generated SQL to ensure index usage and performance.

**Differentiation:**
- **Performance:** Drizzle is simply a thin wrapper over the SQL driver (like `postgres.js`). It executes queries much faster than Prisma's heavy abstraction layer.
- **Complexity:** Drizzle requires you to know SQL. Prisma is easier for beginners who don't want to think about relational algebra, but Drizzle prevents "magic" performance bottlenecks at scale.

---

## 5. Vector Storage: pgvector (Supabase) vs. Pinecone / Weaviate

**Q: Why store embeddings in PostgreSQL instead of a dedicated Vector Database like Pinecone?**

**Answer:**
At v1 scale (less than 1 million vectors per tenant), a dedicated vector database introduces unnecessary operational complexity and network latency. By using `pgvector` inside Supabase, I can colocate my vector data with my relational data. 

When a student queries the RAG system, I can perform a vector similarity search *and* filter by `tenant_id`, `course_id`, and user permissions in a single SQL query. 

**Differentiation:**
- **Scale:** Pinecone scales horizontally to billions of vectors better than Postgres. However, for a multi-tenant SaaS where each tenant searches only their own documents, Postgres partitions easily handle the load.
- **Performance:** Colocation eliminates the network hop between the relational DB and the vector DB. Joins are virtually free.
- **Time/Complexity:** Using pgvector eliminates the need to synchronize data between two databases (e.g., handling edge cases where a document is deleted in Postgres but orphaned in Pinecone).

---

## 6. Tenancy Model: Row-Level Tenancy vs. Schema-per-Tenant

**Q: In a multi-tenant SaaS, why did you choose Row-Level tenancy instead of a separate database or schema per tenant?**

**Answer:**
Schema-per-tenant provides maximum isolation, but it requires running migrations N times (once for each tenant) and managing a dynamic connection pool. Row-level tenancy—where every table has a `tenant_id` column—gives 95% of the isolation guarantee at 20% of the operational cost.

I enforce this security via Drizzle Middleware (which automatically injects `where tenant_id = ?` into every query) and Postgres Row Level Security (RLS) policies.

**Differentiation:**
- **Scale:** Row-level tenancy scales infinitely within a single database instance without consuming additional connection limits. Schema-per-tenant exhausts connection pools quickly.
- **Performance:** A single connection pool handles all tenants, making resource utilization highly efficient.
- **Complexity:** Drastically reduces operational complexity. Migrations are run once. The tradeoff is the risk of a developer forgetting to append `tenant_id` in a query, which is mitigated by our Drizzle middleware.

---

## 7. Async processing: Upstash QStash vs. BullMQ / RabbitMQ

**Q: Why use QStash over traditional queueing systems like BullMQ backed by Redis?**

**Answer:**
Cloudflare Workers (Edge runtimes) operate on HTTP and do not support long-lived, persistent TCP connections required by traditional Redis clients or RabbitMQ. Upstash QStash is an HTTP-based messaging queue designed specifically for serverless and edge functions. 

When a PDF is uploaded, the API simply makes a POST request to QStash, which then reliably calls a webhook on our server to process the ingestion asynchronously.

**Differentiation:**
- **Scale:** QStash manages the queueing infrastructure entirely, scaling transparently.
- **Complexity:** BullMQ requires you to deploy, monitor, and scale a persistent Redis instance and a long-running worker process. QStash requires zero infrastructure management.
- **Time:** Integration takes 5 minutes (just an HTTP call) versus setting up a queue worker environment.
