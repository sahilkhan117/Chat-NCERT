### 🏛️ The Updated Architecture (GraphQL Edition)

Your horizontal layers remain largely the same, but the Cloudflare Edge layer now acts as a GraphQL Gateway.

**1. Client Layer:** Next.js 15 (App Router), Zustand, Apollo Client (or urql) for GraphQL queries.
**2. Edge API (Hono + GraphQL Yoga):** Cloudflare Workers intercepts the request, validates the JWT, resolves the `tenant_id`, and passes it into the **GraphQL Context**.
**3. Service Resolvers:** GraphQL queries and mutations trigger your internal services.
**4. Data Layer:** Drizzle ORM (Supabase) and Mongoose (MongoDB).
**5. Async/AI Layer:** Upstash QStash, Gemini 2.5 Flash, and Ollama.

---

### 🚀 Step-by-Step Recreation Guide

#### Step 1: Initialize the Edge API with Hono & GraphQL

Instead of building standard REST endpoints (`app.get('/posts')`), you will set up a single `/graphql` endpoint.

* **Tech:** Bun, Hono, `graphql-yoga`, and Better-Auth.
* **Execution:** Extract the Bearer token (API Key) in the Hono middleware. Use Better-Auth to validate it and find the `tenant_id`. Pass this `tenant_id` into the GraphQL Yoga context so every resolver automatically knows which tenant is requesting data.

#### Step 2: Design the GraphQL Schema

You will need to define your Types, Queries, and Mutations based on your services:

* **Queries (Data Fetching):** `getFeed(tenantId)`, `getQuizzes`, `askRAG(question, context)`.
* **Mutations (Actions):** `createCommunityPost`, `submitAssignment`, `ingestNCERTPdf`.

#### Step 3: Wire up the Data Layer (Resolvers)

Your GraphQL resolvers will execute the actual database logic.

* **Relational (Supabase + Drizzle):** Use Drizzle inside your resolvers to fetch tenants, users, and subscriptions. Ensure your Drizzle middleware continues to enforce row-level isolation using the `tenant_id` provided by the GraphQL context.
* **Document (MongoDB + Mongoose):** Use Mongoose in your resolvers to fetch community posts, threaded comments, and complex quiz objects.

#### Step 4: Rebuild the RAG Ingestion Pipeline (Async)

GraphQL should not block while processing large PDFs.

* When a user triggers the `ingestNCERTPdf` mutation, upload the file to Cloudflare R2 immediately.
* Have the resolver dispatch an HTTP event to **Upstash QStash**.
* Return a `success: true` response to the Next.js client immediately.
* The QStash background job then processes the PDF via LlamaIndex, chunks it, calls Gemini `text-embedding-004`, and upserts to `pgvector`.

#### Step 5: Implement the RAG Query Pipeline

When a student fires the `askRAG` GraphQL query:

1. The resolver embeds the student's question.
2. It queries `pgvector` for the top-5 cosine similarity matches (filtered by `tenant_id`).
3. It checks the tenant's profile in Supabase.
4. **Routing:** If the tenant has an `ollamaEndpoint`, route the context to their private Qwen-3.5 model. If not, route it to Gemini 2.5 Flash.
5. Return the generated answer through the GraphQL response.

---

### 🛡️ Defending GraphQL in your TCS Prime Interview

Since you are preparing for a system design interview, you must be able to defend *why* you added GraphQL. If an interviewer asks, use these points:

* **Over-fetching Elimination:** "In the community feed, a mobile client might only need post titles and author names, while the web admin portal needs full metadata and analytics. GraphQL allows each client to request exactly what it needs from the same endpoint, reducing bandwidth."
* **Edge Compatibility:** "I didn't use Apollo Server because it's heavy. I paired GraphQL Yoga with Hono on Cloudflare Workers to keep cold starts under 10ms while getting the benefits of a typed schema."
* **Strict Typing:** "By using GraphQL alongside Zod and Drizzle, I achieved end-to-end type safety. The database schema, API contracts, and Next.js frontend all share the same TypeScript definitions."
