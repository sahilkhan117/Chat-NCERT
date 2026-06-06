import { pgTable, uuid, text, timestamp, integer, jsonb, customType } from "drizzle-orm/pg-core";

// Custom type for pgvector (Gemini embedding-004 has 768 dimensions by default)
export const vector = customType<{ data: number[]; config: { dimensions: number } }>({
  dataType(config) {
    const dims = config?.dimensions ?? 768;
    return `vector(${dims})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: unknown): number[] {
    return (value as string)
      .replace(/[\[\]]/g, "")
      .split(",")
      .map(Number);
  },
});

// Tenants Table
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  apiKey: text("api_key").unique().notNull(),
  planTier: text("plan_tier").default("free").notNull(), // free, starter, pro
  ollamaTunnelUrl: text("ollama_tunnel_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").default("student").notNull(), // student, instructor, tenant_admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions Table (Better-Auth compatible)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents Table
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  r2Path: text("r2_path").notNull(),
  class: text("class"),
  subject: text("subject"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Embeddings Table for RAG
export const embeddings = pgTable("embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 768 }).notNull(),
  metadata: jsonb("metadata").default({}).notNull(), // page number, paragraph metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Posts Table (Community Feed)
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  comments: jsonb("comments").default([]).notNull(), // Nested structure: Array<{ id, authorId, content, createdAt, replies: [...] }>
  reactions: jsonb("reactions").default({}).notNull(), // Map: { thumbsup: Array<userId>, heart: Array<userId> }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quizzes Table
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  questions: jsonb("questions").default([]).notNull(), // Array<{ id, text, options: string[], answerKeyIndex: number }>
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quiz Attempts Table
export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  quizId: uuid("quiz_id")
    .references(() => quizzes.id, { onDelete: "cascade" })
    .notNull(),
  score: integer("score").notNull(),
  timeTaken: integer("time_taken").notNull(), // in seconds
  answers: jsonb("answers").default({}).notNull(), // Map: { questionId: selectedIndex }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments Table
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  rubric: jsonb("rubric").default([]).notNull(), // Array<{ criterion, maxPoints }>
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Submissions Table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  assignmentId: uuid("assignment_id")
    .references(() => assignments.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  status: text("status").default("draft").notNull(), // draft, submitted, graded
  grade: jsonb("grade"), // { score, feedback, gradedById, gradedAt }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
