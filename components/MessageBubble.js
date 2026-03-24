"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { renderMarkdown } from "@/utils/formatting";
import toast from "react-hot-toast";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} group`}
    >
      <div
        className="relative max-w-[78%] px-4 py-2.5 text-sm leading-relaxed"
        style={{
          background: isUser ? "var(--user-bubble)" : "var(--ai-bubble)",
          color: "var(--text-primary)",
          borderRadius: isUser
            ? "1.2rem 1.2rem 0.3rem 1.2rem"
            : "1.2rem 1.2rem 1.2rem 0.3rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          border: "1px solid var(--border)",
        }}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div
            className="prose-message break-words"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          aria-label="Copy message"
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: "var(--surface-mid)", border: "1px solid var(--border)" }}
        >
          {copied ? (
            <Check size={11} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Copy size={11} style={{ color: "var(--text-secondary)" }} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
