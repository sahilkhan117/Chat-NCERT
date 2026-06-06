import { z } from "zod";

export const apiEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  UPSTASH_REDIS_URL: z.string().url("UPSTASH_REDIS_URL must be a valid URL"),
  UPSTASH_REDIS_TOKEN: z.string().min(1, "UPSTASH_REDIS_TOKEN is required"),
  UPSTASH_QSTASH_TOKEN: z.string().min(1, "UPSTASH_QSTASH_TOKEN is required"),
  RESEND_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
});

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url("NEXT_PUBLIC_API_URL must be a valid URL"),
  BETTER_AUTH_SECRET: z.string().min(8, "BETTER_AUTH_SECRET must be at least 8 characters"),
});

export function validateApiEnv(env: unknown) {
  const result = apiEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid API Environment Variables:", result.error.format());
    throw new Error("Invalid API environment variables configuration");
  }
  return result.data;
}

export function validateWebEnv(env: unknown) {
  const result = webEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid Web Environment Variables:", result.error.format());
    throw new Error("Invalid Web environment variables configuration");
  }
  return result.data;
}
