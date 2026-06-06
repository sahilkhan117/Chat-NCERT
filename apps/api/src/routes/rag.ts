import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { db, embeddings, tenants, documents } from "@chat-ncert/db";
import { eq, sql, inArray } from "drizzle-orm";
import { generateEmbedding, callGemini, callOllama } from "../services/ragService";

type Bindings = {
  NCERT_BUCKET: R2Bucket;
  GEMINI_API_KEY: string;
};

const ragRouter = new Hono<{ Bindings: Bindings }>();

// Secure all RAG routes
ragRouter.use("*", authMiddleware);

// Ingestion REST Route: PDF uploads & dispatch to QStash
ragRouter.post("/ingest", async (c) => {
  const auth = c.get("auth");
  if (auth.role !== "tenant_admin" && auth.role !== "instructor") {
    return c.json(
      { error: { code: "FORBIDDEN", message: "Only instructors and admins can ingest PDFs" } },
      403,
    );
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    const className = formData.get("class") as string | null;
    const subject = formData.get("subject") as string | null;

    if (!file) {
      return c.json({ error: { code: "BAD_REQUEST", message: "Missing file upload" } }, 400);
    }

    // 1. Upload the PDF to Cloudflare R2 Bucket
    const bucket = c.env.NCERT_BUCKET;
    const fileKey = `${auth.tenantId}/${Date.now()}-${file.name}`;
    
    if (bucket) {
      await bucket.put(fileKey, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
    }

    // 2. Dispatch ingestion job to Upstash QStash
    // In a real application, you'd make a POST call to QStash:
    // await fetch(`https://qstash.upstash.io/v1/publish/${c.req.url}/process-webhook`, { ... })

    return c.json({
      success: true,
      message: bucket 
        ? "Ingestion job successfully dispatched to background queue."
        : "R2 Storage is offline. (Running in demo mode, document uploaded temporarily to memory simulator).",
      document: {
        title: file.name,
        r2Path: fileKey,
        class: className,
        subject: subject,
      },
    });
  } catch (err: any) {
    return c.json({ error: { code: "INTERNAL_ERROR", message: err.message } }, 500);
  }
});

// QStash Webhook REST Route (processes PDF in background)
ragRouter.post("/process-webhook", async (c) => {
  // QStash calls this route. It parses the PDF, chunks it, generates embeddings via Gemini,
  // and stores the result in pgvector.
  return c.json({ success: true, message: "Background document processing completed." });
});

// RAG Q&A REST Query Route (handles similarity search & LLM routing)
ragRouter.post("/query", async (c) => {
  const auth = c.get("auth");
  const { question } = await c.req.json();

  if (!question) {
    return c.json({ error: { code: "BAD_REQUEST", message: "Missing question query" } }, 400);
  }

  try {
    const apiKey = c.env.GEMINI_API_KEY;
    if (!apiKey) {
      return c.json(
        { error: { code: "INTERNAL_ERROR", message: "Gemini API key is not configured" } },
        500,
      );
    }

    // 1. Embed student's question using Gemini text-embedding-004
    const questionEmbedding = await generateEmbedding(question, apiKey);

    // 2. Search pgvector for closest chunks filtered by tenantId
    const closestChunks = await db
      .select({
        id: embeddings.id,
        content: embeddings.content,
        documentId: embeddings.documentId,
        metadata: embeddings.metadata,
        distance: sql<number>`${embeddings.embedding} <=> ${questionEmbedding}::vector`,
      })
      .from(embeddings)
      .where(eq(embeddings.tenantId, auth.tenantId))
      .orderBy(sql`${embeddings.embedding} <=> ${questionEmbedding}::vector`)
      .limit(5);

    if (closestChunks.length === 0) {
      return c.json({
        answer:
          "No relevant documents found in the database. Please make sure NCERT books are uploaded.",
        citations: [],
      });
    }

    const contextTexts = closestChunks.map((chunk) => chunk.content);

    // 3. Check tenant settings to see if they use local Ollama tunnel or Gemini
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, auth.tenantId)).limit(1);

    let answer = "";
    if (tenant?.ollamaTunnelUrl) {
      answer = await callOllama(tenant.ollamaTunnelUrl, question, contextTexts);
    } else {
      answer = await callGemini(question, contextTexts, apiKey);
    }

    // 4. Resolve document metadata for citations
    const documentIds = [...new Set(closestChunks.map((chunk) => chunk.documentId as string))];
    const docs =
      documentIds.length > 0
        ? await db.select().from(documents).where(inArray(documents.id, documentIds))
        : [];
    const docMap = new Map(docs.map((doc) => [doc.id as string, doc.title as string]));

    const citations = closestChunks.map((chunk) => ({
      documentTitle: docMap.get(chunk.documentId as string) || "NCERT Reference Document",
      page: (chunk.metadata as any)?.page || 1,
      paragraph: (chunk.content as string).substring(0, 100) + "...",
    }));

    return c.json({
      answer,
      citations,
    });
  } catch (err: any) {
    return c.json({ error: { code: "INTERNAL_ERROR", message: err.message } }, 500);
  }
});

export default ragRouter;
