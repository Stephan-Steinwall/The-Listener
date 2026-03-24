"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const PERSONAS = [
  { value: "assistant", label: "Assistant" },
  { value: "eli5", label: "Explain like I'm 5" },
  { value: "coach", label: "Coach" },
];

export default function ChatHeader({ persona, onPersonaChange }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Theme Toggle */}
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: "var(--surface-mid)" }}
      >
        {mounted ? (
          theme === "dark" ? (
            <Sun size={16} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <Moon size={16} style={{ color: "var(--text-secondary)" }} />
          )
        ) : (
          <div className="w-4 h-4" />
        )}
      </button>

      {/* Center identity */}
      <div className="flex flex-col items-center gap-0.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "var(--user-bubble)" }}
        >
          <Heart size={16} fill="currentColor" style={{ color: "var(--taupe, #6b5c55)" }} />
        </div>
        <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
          Listener
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
          Here for you
        </span>
      </div>

      {/* Persona Selector */}
      <select
        value={persona}
        onChange={(e) => onPersonaChange(e.target.value)}
        aria-label="Select persona"
        className="text-xs rounded-xl px-2 py-1.5 border-0 outline-none cursor-pointer transition-all duration-200 hover:opacity-80"
        style={{
          background: "var(--surface-mid)",
          color: "var(--text-primary)",
          maxWidth: "110px",
        }}
      >
        {PERSONAS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </header>
  );
}
