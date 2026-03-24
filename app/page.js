"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { Wind } from "lucide-react"; // Import the icon for the button
import ReleaseModal from "@/components/ReleaseModal"; // Import the new modal

export default function Home() {
  const [persona, setPersona] = useState("best_friend");
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false); // State to control the modal

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

      {/* Container for the Chat Input and the new Vent Button */}
      <div className="relative">
        {/* The new button to open the Vent space */}
        <div className="absolute -top-10 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() => setIsReleaseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--surface-mid)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Wind size={14} />
            Need to vent & release?
          </button>
        </div>

        <ChatInput
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Mount the Modal outside the standard flow */}
      <ReleaseModal
        isOpen={isReleaseModalOpen}
        onClose={() => setIsReleaseModalOpen(false)}
      />
    </div>
  );
}