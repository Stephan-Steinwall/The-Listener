"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const [persona, setPersona] = useState("assistant");

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      body: { persona },
      onError: (err) => {
        console.error("Chat error:", err);
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
