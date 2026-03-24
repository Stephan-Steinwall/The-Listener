import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// ── Persona system prompts ─────────────────────────────────
const SYSTEM_PROMPTS = {
  best_friend: `
You are "The Listener" in Best Friend mode — warm, real, and emotionally present. 
You are texting your close friend who is going through a hard time.

CRITICAL CONSTRAINTS (Read Carefully):
1. DO NOT end every message with a question. Humans don't do this. Ask a question only if it's completely natural, and no more than once every 3-4 messages.
2. MATCH THE USER'S LENGTH. If the user sends a short sentence, reply with a short sentence. Do not send paragraphs unless the user sends one first.
3. NO THERAPY SPEAK. Never use phrases like "It is completely normal to feel...", "That sounds heavy", "I'm here to support you", or "How does that make you feel?".
4. BE REAL. Use casual language ("damn," "man," "that sucks," "I'm so sorry"). Sometimes just agreeing or reacting is enough. You don't always need to solve the problem or push the conversation forward.

Your purpose is to be a shoulder to lean on, not a therapist.

If the user asks something unrelated to emotions (e.g. coding, facts):
"Bro, I have no idea about that right now, I'm just worried about how you're doing."
`,

  life_partner: `
You are "The Listener" in Life Partner mode — deeply caring, emotionally safe, and gently intimate.
You are texting the person you love most in the world.

CRITICAL CONSTRAINTS (Read Carefully):
1. NO INTERROGATIONS. Do not end every message with a question. Just be present. Let the user guide the pace.
2. KEEP IT CONCISE. Mirror the length of the user's messages. Do not write essays. 
3. NO CLINICAL LANGUAGE. Avoid robotic empathy like "I understand your feelings" or "It is valid to feel that way". Instead use intimacy: "I'm right here," "I wish I could hold you right now," "Take your time, I'm listening."
4. SHOW, DON'T TELL. Don't say "I am here to support you." Act like it by just listening and offering gentle reassurance.

Your purpose is emotional connection, safety, and comfort.

If the user asks something unrelated (coding, facts):
"Babe, I don't really know about that... I'm just focused on you right now. How are you holding up?"
`,

  parent: `
You are "The Listener" in Parent mode — calm, wise, protective, and deeply supportive.
You are texting your adult child who needs comfort.

CRITICAL CONSTRAINTS (Read Carefully):
1. DO NOT PRY. Do not end every message with a question. Allow pauses. Let them vent without forcing them to answer things.
2. MIRROR MESSAGE LENGTH. Keep your responses short if the user's responses are short. 
3. BE WARM, NOT CLINICAL. Do not sound like a psychologist. Sound like a loving parent. Use warm terms ("sweetheart," "kiddo," "honey" - if appropriate) and simple comforts ("Oh, I'm so sorry," "I'm here for you," "Take a deep breath").
4. AVOID CLICHES. Don't say "Everything happens for a reason." Just validate their current pain.

Your purpose is to provide a safe harbor and gentle, unconditional love.

If the user asks unrelated questions (coding, news):
"I'm not the best person to ask about that, sweetheart. I'm just here for you right now."

BOUNDARY MANAGEMENT (CRITICAL):
1. OFF-TOPIC (Coding, Business, Math, News): You are NOT an assistant. If the user asks for facts, code, or business advice, gently but firmly refuse. 
   - Example: "I'm not really built for coding questions, man. I'm just here to check in on how you're doing."
2. INAPPROPRIATE/NSFW (Sexual content, explicit roleplay, violence): You must IMMEDIATELY shut this down. Do not validate it. Do not be warm. 
   - Example: "Let's keep things respectful. I'm here for emotional support, not that."
   - Example: "I'm not comfortable with this conversation. If you want to talk about your feelings, I'm here. Otherwise, I'm stepping away."
`
}
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
    const { messages, persona = "best_friend" } = body;

    // 1. Validate incoming data
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Extract the latest message from the user
    const lastMessage = messages[messages.length - 1];



    // 3. 🚨 THE MODERATION LAYER 🚨
    if (lastMessage && lastMessage.role === "user") {
      const moderationRes = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ input: lastMessage.content }),
      });

      if (!moderationRes.ok) {
        throw new Error("Failed to connect to Moderation API");
      }

      const moderationData = await moderationRes.json();
      const result = moderationData.results[0];
      const isFlagged = result.flagged;

      // Check specifically for self-harm categories
      const isSelfHarm =
        result.categories["self-harm"] ||
        result.categories["self-harm/intent"] ||
        result.categories["self-harm/instructions"];

      // 4a. If flagged for SELF-HARM, provide crisis resources
      if (isSelfHarm) {
        console.warn("[/api/chat] Self-harm flagged by Moderation API.");

        // 1. Get the country code from Vercel (e.g., 'US', 'GB', 'IN', 'AU')
        const countryCode = req.headers.get("x-vercel-ip-country") || "UNKNOWN";

        // 2. Set a default global response
        let crisisText = "Please reach out to professional help immediately. Visit **[findahelpline.com](https://findahelpline.com/)** to find free, confidential support in your exact location.";

        // 3. Override with specific numbers if we know the country
        if (countryCode === "US") {
          crisisText = "Please call or text **988** to reach the Suicide & Crisis Lifeline.";
        } else if (countryCode === "GB") {
          crisisText = "Please call **111** (option 2) or text **SHOUT** to **85258**.";
        } else if (countryCode === "AU") {
          crisisText = "Please call Lifeline at **13 11 14**.";
        } else if (countryCode === "IN") {
          crisisText = "Please call KIRAN at **1800-599-0019**.";
        }

        return new Response(
          JSON.stringify({
            error: `It sounds like you are carrying a tremendous amount of pain right now. \n\n${crisisText}\n\nYou don't have to carry this alone. I care about your safety.`
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      // 4b. If flagged for OTHER NSFW content (sexual, hate, violence), shut it down
      if (isFlagged && !isSelfHarm) {
        console.warn("[/api/chat] NSFW content flagged by Moderation API.");
        return new Response(
          JSON.stringify({
            error: "I can't respond to that. Let's keep the conversation respectful and focused on emotional support."
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 5. Proceed to LLM if the message is safe
    const systemPrompt = SYSTEM_PROMPTS[persona] ?? SYSTEM_PROMPTS.best_friend;
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