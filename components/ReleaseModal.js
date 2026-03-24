"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, X } from "lucide-react";

export default function ReleaseModal({ isOpen, onClose }) {
  const [ventText, setVentText] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = () => {
    if (!ventText.trim()) return;

    setIsReleasing(true);

    // Wait for the animation to finish, then clear and close
    setTimeout(() => {
      setVentText("");
      setIsReleasing(false);
      onClose();
    }, 2000); // 2 seconds gives the animation time to play
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* The Modal Box */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* Close Button (disabled while releasing) */}
            {!isReleasing && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={18} style={{ color: "var(--text-secondary)" }} />
              </button>
            )}

            <h2 className="text-xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Let it go.
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Type out whatever is weighing you down. It won't be saved, and I won't reply to it. When you're ready, release it.
            </p>

            {/* The Text Area with the Release Animation */}
            <motion.div
              animate={
                isReleasing
                  ? {
                    opacity: 0,
                    y: -100,
                    filter: "blur(12px)",
                    scale: 0.9,
                  }
                  : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
              }
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <textarea
                value={ventText}
                onChange={(e) => setVentText(e.target.value)}
                disabled={isReleasing}
                placeholder="I am feeling overwhelmed because..."
                className="w-full h-40 resize-none rounded-xl p-4 outline-none text-base"
                style={{
                  background: "var(--surface-mid)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              />
            </motion.div>

            {/* The Release Button */}
            <motion.button
              onClick={handleRelease}
              disabled={!ventText.trim() || isReleasing}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg)",
                opacity: !ventText.trim() || isReleasing ? 0.5 : 1,
              }}
            >
              <Wind size={18} />
              {isReleasing ? "Releasing..." : "Release to the wind"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}