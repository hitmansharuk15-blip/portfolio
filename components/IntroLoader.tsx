"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/data";

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only show once per session (so it doesn't annoy the user on refresh)
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasVisited", "true");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const skipIntro = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasVisited", "true");
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Animated Monogram */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 border border-glass-border rounded-xl flex items-center justify-center mb-8 glass"
          >
            <span className="font-shout font-bold text-2xl tracking-tighter">{site.monogram}</span>
          </motion.div>
          
          {/* Loading Line */}
          <div className="w-48 h-[1px] bg-glass-border overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-ice"
            />
          </div>

          {/* Skip Button */}
          <button
            onClick={skipIntro}
            className="absolute bottom-10 right-10 meta text-muted hover:text-paper transition-colors"
          >
            SKIP INTRO ↗
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}