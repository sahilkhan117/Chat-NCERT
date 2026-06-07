# 📚 Chat-NCERT — AI Tutor & Social Learning Platform

<div align="center">

<img src="apps/web/public/logo.png" alt="Chat-NCERT Logo" width="450" />

<br/>
<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://chat-ncert-a-ncert-based-rag-ai-tut.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Bun](https://img.shields.io/badge/Bun-1.x-fbf0df?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)

**A multi-tenant NCERT-based RAG AI tutoring platform with social learning features, quizzes, and assignments.**

[🌐 Live Demo](https://chat-ncert-a-ncert-based-rag-ai-tut.vercel.app/) · [🐛 Report Bug](https://github.com/sahilkhan117/Chat-NCERT/issues) · [✨ Request Feature](https://github.com/sahilkhan117/Chat-NCERT/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **RAG AI Chat** | Ask questions about NCERT textbooks powered by vector search + Gemini/Ollama |
| 📝 **Quizzes** | Auto-generated quizzes from NCERT content with scoring & leaderboards |
| 📋 **Assignments** | Assignment creation, submission, and AI-assisted grading with rubrics |
| 🌍 **Community Feed** | Social posts, reactions (👍 ❤️), threaded comments between students |
| 🏫 **Multi-tenant** | Each school/institution gets isolated data with API key-based access |
| ⚙️ **Settings** | Configure Ollama endpoint, branding colors, logo, and model preferences |
| 🔐 **Auth** | Session-based authentication via Better-Auth |
| 🧠 **Vector Search** | pgvector-powered semantic search on embedded NCERT document chunks |

---

## 🖥️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** — App Router, server components, edge runtime
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[TypeScript](https://www.typescriptlang.org/)** — Full type safety

### Backend / Data
- **[Supabase](https://supabase.com/)** — PostgreSQL with pgvector extension
- **[Drizzle ORM](https://orm.drizzle.team/)** — Type-safe ORM with migrations
- **[pgvector](https://github.com/pgvector/pgvector)** — Vector similarity search for RAG
- **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** — Document/PDF storage
- **[Google Gemini](https://ai.google.dev/)** — `embedding-004` model (768 dims) + LLM
- **[Ollama](https://ollama.ai/)** — Self-hosted LLM option via tunnel URL

### Infrastructure
- **[Vercel](https://vercel.com/)** — Frontend deployment
- **[Bun](https://bun.sh/)** — Fast package manager & runtime
- **[Turborepo](https://turbo.build/)** / Bun Workspaces — Monorepo management

---

## 🗂️ Project Structure

```
Chat-NCERT/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx            # Landing page
│       │   │   └── dashboard/
│       │   │       ├── page.tsx        # Student dashboard (bento grid)
│       │   │       ├── rag/            # AI chat interface
│       │   │       ├── quizzes/        # Quiz list + [id] player
│       │   │       ├── assignments/    # Assignment submission
│       │   │       ├── community/      # Social feed
│       │   │       └── settings/       # Tenant settings
│       │   └── components/
│       │       └── layout/
│       │           └── sidebar.tsx     # Navigation sidebar
│       ├── vercel.json
│       └── wrangler.toml
├── packages/
│   ├── db/                     # Drizzle ORM + schema
│   │   └── src/
│   │       ├── schema.ts       # All table definitions
│   │       └── index.ts        # DB connection (lazy proxy)
│   ├── config/                 # Shared config (ESLint, TS)
│   └── types/                  # Shared TypeScript types
└── package.json                # Bun workspace root
```

---

## 🗃️ Database Schema

```
tenants          → Multi-tenant isolation (school/org)
users            → Students, instructors, admins
sessions         → Auth sessions (Better-Auth)
documents        → NCERT PDFs metadata (stored in R2)
embeddings       → 768-dim vectors for RAG (pgvector)
posts            → Community feed posts
quizzes          → Quiz definitions with MCQ questions
quiz_attempts    → Student quiz results & scores
assignments      → Assignment definitions with rubrics
submissions      → Student submissions + grades
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.0`
- [Node.js](https://nodejs.org/) `>= 18`
- [Supabase](https://supabase.com/) account (PostgreSQL + pgvector)

### 1. Clone the repository

```bash
git clone https://github.com/sahilkhan117/Chat-NCERT.git
cd Chat-NCERT
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create `packages/db/.env`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

Create `apps/web/.env.local`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Enable pgvector on Supabase

Run in the Supabase SQL editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 5. Run database migrations

```bash
cd packages/db
bun run drizzle-kit push
```

### 6. Seed the database (optional)

To populate the database with sample tenants, users, documents, quizzes, posts, and assignments, run from the monorepo root:

```bash
bun run db:seed
```

### 7. Start the development server

```bash
# From monorepo root
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### Vercel (Frontend)

1. Import repo at [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `apps/web`
3. Set **Framework** to `Next.js`
4. Add environment variable: `DATABASE_URL`
5. Deploy ✅

### Environment Variables Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key for embeddings + LLM |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name for document storage |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ for Indian students | Powered by NCERT + AI

</div>
