

export interface Citation {
  documentTitle: string;
  page: number;
  paragraph: string;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
}

/**
 * Split text into chunks with a defined overlap.
 */
export function chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Generate embedding using Gemini's text-embedding-004 model.
 */
export async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text }] },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Embedding API error: ${errText}`);
  }

  const result: any = await response.json();
  return result.embedding.values;
}

/**
 * Call Gemini 2.5 Flash model for answering with retrieved context.
 */
export async function callGemini(
  prompt: string,
  context: string[],
  apiKey: string,
): Promise<string> {
  const systemPrompt = `You are an AI academic assistant for Chat-NCERT. Use the following context documents to answer the student's question accurately. If you don't know the answer or if it's not present in the context, state that you cannot find it in the uploaded documents.
  
Context:
${context.map((c, i) => `[Doc ${i + 1}]: ${c}`).join("\n\n")}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nQuestion: ${prompt}` }] },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini LLM API error: ${errText}`);
  }

  const result: any = await response.json();
  return result.candidates[0].content.parts[0].text;
}

/**
 * Call Ollama model via tenant's exposed tunnel endpoint.
 */
export async function callOllama(
  endpoint: string,
  prompt: string,
  context: string[],
): Promise<string> {
  const systemPrompt = `You are an AI academic assistant for Chat-NCERT. Use the following context documents to answer the student's question.
  
Context:
${context.map((c, i) => `[Doc ${i + 1}]: ${c}`).join("\n\n")}`;

  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen2.5:3b", // tenant's private model
      prompt: `${systemPrompt}\n\nQuestion: ${prompt}`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama local tunnel endpoint error: ${response.statusText}`);
  }

  const result: any = await response.json();
  return result.response;
}
