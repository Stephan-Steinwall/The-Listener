"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Heart, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PERSONAS = [
  {
    value: "best_friend",
    label: "Best Friend",
    emoji: "🫂",
    description: "Warm, real & emotionally present",
  },
  {
    value: "life_partner",
    label: "Life Partner",
    emoji: "🤍",
    description: "Deeply caring & emotionally safe",
  },
  {
    value: "parent",
    label: "Parent",
    emoji: "🌿",
    description: "Calm, wise & protective",
  },
];

export default function ChatHeader({ persona, onPersonaChange }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = PERSONAS.find((p) => p.value === persona) ?? PERSONAS[0];

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between gap-2 px-3 sm:px-5 py-3"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Theme Toggle — fixed width to balance the right side */}
      <div className="w-24 flex items-center">
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
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
      </div>

      {/* Center identity — enhanced brand lockup */}
      <div className="flex flex-col items-center gap-1 min-w-0">
        {/* Avatar with subtle pulse ring */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--user-bubble)", opacity: 0.4 }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "var(--user-bubble)" }}
          >
            <Heart size={17} fill="currentColor" style={{ color: "#9c6e65" }} />
          </div>
        </div>

        {/* Name + badge */}
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="text-sm font-bold tracking-wide leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            The Listener
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "var(--surface-mid)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            ✦ Always here for you
          </span>
        </div>
      </div>

      {/* Persona Dropdown — fixed width to balance the left side */}
      <div className="w-24 flex items-center justify-end">
      <div className="relative" ref={dropdownRef}>
        <button
          id="persona-selector"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80 active:scale-95"
          style={{
            background: "var(--surface-mid)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <span>{current.emoji}</span>
          <span className="hidden sm:inline">{current.label}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={12} style={{ color: "var(--text-secondary)" }} />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="listbox"
              aria-label="Select persona"
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                zIndex: 50,
              }}
            >
              {PERSONAS.map((p) => {
                const isActive = p.value === persona;
                return (
                  <button
                    key={p.value}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onPersonaChange(p.value);
                      setOpen(false);
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150"
                    style={{
                      background: isActive ? "var(--surface-mid)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "var(--surface-mid)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span className="text-lg leading-none mt-0.5">{p.emoji}</span>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {p.label}
                      </span>
                      <span
                        className="text-[11px] leading-tight"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {p.description}
                      </span>
                    </div>
                    {isActive && (
                      <span
                        className="ml-auto text-xs self-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </header>
  );
}
