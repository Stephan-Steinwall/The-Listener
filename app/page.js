"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const [persona, setPersona] = useState("best_friend");

  // 1. We added setMessages here to manually update the chat history
  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { persona },

      // 2. The updated onError handler
      onError: (err) => {
        console.error("Chat error:", err);

        try {
          // The Vercel AI SDK attaches your backend JSON response to the err.message string
          const parsedError = JSON.parse(err.message);

          if (parsedError.error) {
            // Append the backend error message as an assistant chat bubble
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: `mod-error-${Date.now()}`,
                role: "assistant", // Makes it look like the AI said it
                content: parsedError.error,
              },
            ]);
          }
        } catch (parseError) {
          // Fallback just in case it's a generic server crash (like a 500 error)
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: `sys-error-${Date.now()}`,
              role: "assistant",
              content: "I'm having a little trouble connecting right now. Let's take a breath and try again in a moment.",
            },
          ]);
        }
      },
    });

  return (
    <div className="ambient-glow relative flex flex-col h-screen overflow-hidden">
      <ChatHeader persona={persona} onPersonaChange={setPersona} />
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}