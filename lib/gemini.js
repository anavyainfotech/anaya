import { GoogleGenAI } from "@google/genai";

// High-speed, ultra low-latency models benchmarked for instantaneous response:
// 1. gemini-3.1-flash-lite: Consistently fast ~800ms - 1s response, lowest latency
// 2. gemini-3.5-flash: Fast, high reliability fallback
// 3. gemini-flash-lite-latest: Dynamic lowest-latency pointer
// 4. gemini-3.5-flash-lite: High throughput backup
// 5. gemini-3.8-flash: Flagship fallback
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

export async function generateEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment");
  }

  const cleanInput = text.slice(0, 8000).trim();
  if (!cleanInput) return null;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: cleanInput,
    config: { outputDimensionality: 768 },
  });

  if (response.embeddings && response.embeddings.length > 0) {
    return response.embeddings[0].values;
  }
  return null;
}

/**
 * Intelligent Sales Assistant Generation with Multi-Model Auto-Fallback
 */
export async function generateChatResponse({ systemPrompt, messages, contextDocs = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Format relevant knowledge base context
  const contextSnippet = contextDocs.length > 0
    ? `\n\n### STORE KNOWLEDGE BASE (USE THIS TO ANSWER VISITOR QUESTIONS):\n` +
      contextDocs.map((doc, idx) => `[Source ${idx + 1}: ${doc.title || doc.url}]\n${doc.markdown_content || ""}`).join("\n\n---\n\n")
    : "";

  const finalSystemInstruction = (systemPrompt || "You are an autonomous AI sales assistant.") + contextSnippet;

  // Format message history
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  let lastError = null;

  // Try each model in sequence; if one hits rate-limit/quota, immediately fallback to next
  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.65,
          maxOutputTokens: 600,
        }
      });

      if (response && response.text) {
        return {
          text: response.text,
          modelUsed: modelName,
        };
      }
    } catch (err) {
      console.warn(`[Gemini Fallback] Model ${modelName} failed or throttled. Trying next...`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All Gemini fallback models exhausted: ${lastError?.message || "Unknown error"}`);
}
