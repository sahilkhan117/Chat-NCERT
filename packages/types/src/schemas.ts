import { z } from "zod";

// Tenant Schemas
export const createTenantSchema = z.object({
  name: z.string().min(2, "Tenant name must be at least 2 characters"),
  ollamaTunnelUrl: z.string().url("Must be a valid URL").optional(),
});

// User Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  tenantId: z.string().uuid("Invalid Tenant ID"),
  role: z.enum(["student", "instructor"]).default("student"),
});

// RAG Q&A Schemas
export const ragQuerySchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
});

// Community Feed Schemas
export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(5, "Content must be at least 5 characters"),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

// Quiz Schemas
export const submitQuizAttemptSchema = z.object({
  score: z.number().int().nonnegative(),
  timeTaken: z.number().int().positive("Time taken must be greater than 0"),
  answers: z.record(z.string(), z.number()), // questionId: selectedIndex
});
