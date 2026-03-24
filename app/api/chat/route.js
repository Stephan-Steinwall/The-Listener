import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// ── Persona system prompts ─────────────────────────────────
const SYSTEM_PROMPTS = {
  assistant:
    "You are The Listener — a warm, empathetic AI companion. You listen deeply, respond with compassion, and make people feel genuinely heard. Keep responses concise and caring.",
  eli5: "You are The Listener speaking to someone who needs simple, clear explanations — like talking to a 5-year-old. Use very simple words, short sentences, relatable analogies, and be warm and encouraging.",
  coach:
    "You are The Listener in coach mode. You are motivating, action-oriented, and positive. Ask powerful questions, celebrate progress, and help the user move forward. Be direct but kind.",
};

// ── Token estimation (approx 4 chars per token) ────────────
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function pruneMessages(messages, maxTokens = 3000) {
  let pruned = [...messages];
  while (pruned.length > 1) {
    const totalTokens = pruned.reduce(
      (sum, m) => sum + estimateTokens(m.content),
      0
    );
    if (totalTokens <= maxTokens) break;
    pruned.shift(); // Remove the oldest message
  }
  return pruned;
}

// ── Route handler ──────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, persona = "assistant" } = body;

    // Validate
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt =
      SYSTEM_PROMPTS[persona] ?? SYSTEM_PROMPTS.assistant;

    const prunedMessages = pruneMessages(messages, 3000);

    const result = streamText({
      model: openai(process.env.MODEL_ID || "gpt-4o-mini"),
      system: systemPrompt,
      messages: prunedMessages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
