"use client";

import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatInput({ input, onInputChange, onSubmit, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (input.trim()) onSubmit(e);
    }
  };

  return (
    <footer
      className="sticky bottom-0 z-10 px-4 py-3"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <form
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "var(--input-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <textarea
          id="chat-input"
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Say anything…"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none py-1 max-h-32 overflow-y-auto"
          style={{ color: "var(--text-primary)" }}
        />

        <motion.button
          type="submit"
          id="send-button"
          disabled={isLoading || !input.trim()}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--user-bubble)" }}
          aria-label="Send message"
        >
          {isLoading ? (
            <LoadingDots />
          ) : (
            <Send size={14} style={{ color: "var(--text-primary)" }} />
          )}
        </motion.button>
      </form>

      <p
        className="text-center text-[10px] mt-2"
        style={{ color: "var(--text-secondary)", opacity: 0.5 }}
      >
        Press Enter to send · Shift+Enter for new line
      </p>
    </footer>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--text-primary)" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
