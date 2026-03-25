"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <main className="relative z-0 flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-2 min-h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-24">
            <p
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Take a deep breath.
            </p>
            <p className="text-base sm:text-lg" style={{ color: "var(--text-secondary)", opacity: 0.75 }}>
              I&apos;m here to listen.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 self-start pl-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "var(--text-secondary)",
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.9s",
          }}
        />
      ))}
    </div>
  );
}
