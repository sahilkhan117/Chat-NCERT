# Chat-NCERT Frontend Architecture & Structure

This document outlines the directory structure, page routing, and component placements for the Next.js 15 App Router frontend (`apps/web`).

---

## 1. Directory Structure

```text
apps/web/
├── src/
│   ├── app/                    # Next.js 15 Page Routes
│   │   ├── (public)/           # Landing page & Auth
│   │   │   ├── page.tsx        # Public marketing & pricing
│   │   │   └── login/
│   │   │       └── page.tsx    # Better-Auth tenant login page
│   │   ├── super-admin/        # Super Admin Portal (Tenant manager)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/              # Tenant Admin Settings (Branding, Ollama endpoint)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── instructor/         # Instructor Portal (PDF uploads, Quiz builder)
│   │   │   ├── page.tsx
│   │   │   ├── documents/
│   │   │   │   └── page.tsx
│   │   │   ├── quizzes/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── dashboard/          # Student Workspace (RAG Chat, Feed, Quizzes)
│   │       ├── page.tsx        # Dashboard home (recent activities)
│   │       ├── rag/
│   │       │   └── page.tsx    # Interactive RAG Q&A chatbot
│   │       ├── community/
│   │       │   └── page.tsx    # Social Feed & group posts
│   │       ├── quizzes/
│   │       │   ├── page.tsx    # Quizzes list
│   │       │   └── [id]/
│   │       │       └── page.tsx # Interactive quiz taker
│   │       ├── assignments/
│   │       │   └── page.tsx    # Assignment lists & submissions
│   │       └── layout.tsx      # Sidebar navigation & header layout
│   ├── components/             # Reusable UI & Feature Components
│   │   ├── ui/                 # Shadcn-UI elements (Card, Button, Dialog, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx     # Dynamic navigation panel by user role
│   │   │   └── header.tsx      # Brand header, notifications, profile
│   │   ├── features/
│   │   │   ├── chat-box.tsx    # RAG Chat interface with citation popups
│   │   │   ├── feed-card.tsx   # Social feed post with comment thread
│   │   │   ├── quiz-runner.tsx # Quiz answering wizard with timer
│   │   │   └── pdf-upload.tsx  # Drag & drop upload target to R2
│   │   └── providers/
│   │       ├── apollo-provider.tsx  # GraphQL Client connection setup
│   │       └── auth-provider.tsx    # Session context management
│   ├── hooks/                  # Custom React Hooks
│   │   ├── use-chat.ts         # Handles REST RAG querying and response loading
│   │   └── use-auth.ts         # Handles session checking & redirects
│   ├── lib/                    # Helper utilities
│   │   ├── utils.ts            # Tailwind merging (cn)
│   │   └── apollo-client.ts    # Configured Apollo Client for /graphql
│   └── store/                  # Zustand Global State
│       └── use-store.ts        # Client-side user settings, dark mode, etc.
```

---

## 2. Pages & Navigation Mapping

| Route | Accessible By | Purpose / Features |
|---|---|---|
| `/` | Public | Marketing site, SaaS pricing tables, feature comparison. |
| `/login` | Public | Tenant email/password login and magic links. |
| `/super-admin` | Super Admin | Dashboard listing tenants, active plan seats, monthly API usage, and the tenant provisioning forms. |
| `/admin` | Tenant Admin | Manage branding (logo, colors), configure Ollama public tunnel endpoint, invite instructors. |
| `/instructor` | Instructor | Upload and parse NCERT PDFs, create quizzes (with AI prompt configurations), grade student assignments. |
| `/dashboard` | Student | Landing overview showing upcoming assignments, recent quiz scores, and quick links. |
| `/dashboard/rag` | Student | Custom chatbot interface that sends questions to `/api/v1/rag/query` and renders citations. |
| `/dashboard/community`| Student | GraphQL-backed interactive social feed allowing posts, comments, nested threads, and reaction mutations. |
| `/dashboard/quizzes` | Student | List of active quizzes and the interactive quiz taker view. |
| `/dashboard/assignments`| Student | List of student assignments, download file instructions, and drag-and-drop file submissions to R2. |

---

## 3. Core Feature Components Details

### 1. `ChatBox` (`src/components/features/chat-box.tsx`)
*   **Location:** Student RAG page (`/dashboard/rag`)
*   **Props:** None (holds internal message history state)
*   **Behavior:**
    *   Renders list of messages (`user` / `assistant`).
    *   assistant responses parsed for Markdown syntax.
    *   Renders citation highlights (e.g. `[Doc 1, p. 12]`). Hovering shows the source context preview, clicking navigates to the PDF view.
    *   Connects to `useChat` hook to send POST queries to the Workers API gateway.

### 2. `FeedCard` (`src/components/features/feed-card.tsx`)
*   **Location:** Community Feed page (`/dashboard/community`)
*   **Props:** `post: PostData`
*   **Behavior:**
    *   Displays author avatar, name, content, and timestamp.
    *   Shows reactions container (thumbs up / heart toggle) firing GraphQL mutations.
    *   Includes a togglable nested comment drawer. Renders threaded reply threads recursively.

### 3. `QuizRunner` (`src/components/features/quiz-runner.tsx`)
*   **Location:** Quiz Details page (`/dashboard/quizzes/[id]`)
*   **Props:** `quiz: QuizData`
*   **Behavior:**
    *   Uses steps state to render one question at a time.
    *   Includes a countdown timer based on allotted quiz duration.
    *   Dispatches GraphQL mutation `submitQuizAttempt` to save results in Supabase upon completion.

### 4. `PDFUpload` (`src/components/features/pdf-upload.tsx`)
*   **Location:** Instructor Documents view (`/instructor/documents`)
*   **Props:** None
*   **Behavior:**
    *   Standard drag-and-drop file area.
    *   Accepts `.pdf`, maximum file size 20MB.
    *   Executes REST request `multipart/form-data` to `/api/v1/rag/ingest`.

---

## 4. UI Themes & Aesthetics Guidelines

Following premium modern design standards:
- **Default Dark Mode:** Sleek dark HSL background (`hsl(222.2, 84%, 4.9%)`) with bright indigo accents (`hsl(263.4, 70%, 50.4%)`).
- **Glassmorphism:** Use translucent card headers with background blurs: `bg-slate-900/50 backdrop-blur-md border border-slate-800`.
- **Micro-animations:** Hover transitions on navigation sidebars, buttons, and badges (`transition-all duration-300 transform hover:scale-[1.02]`).
- **Harmonious Badges:** Clearly label plan status, roles, and course categories with colored pills.
