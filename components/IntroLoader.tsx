"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/data";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

// Helper to generate a random string of text
const generateRandomText = (length: number) => {
  return Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");
};

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [columns, setColumns] = useState<{ text: string; duration: number; delay: number }[]>([]);

  const statusMessages = [
    "ESTABLISHING CONNECTION...",
    "BYPASSING SECURITY...",
    "DECRYPTING PROFILE...",
    `IDENTITY CONFIRMED: ${site.firstName.toUpperCase()}`,
    "ACCESS GRANTED",
  ];

  useEffect(() => {
    // 1. Generate the Matrix columns ONCE on mount
    const newColumns = Array.from({ length: 25 }).map(() => ({
      text: generateRandomText(80), // Enough characters to fill the screen
      duration: Math.random() * 4 + 4, // Between 4 and 8 seconds
      delay: Math.random() * -8, // Random start position so it looks continuous
    }));
    setColumns(newColumns);

    // 2. Failsafe
    const failsafe = setTimeout(() => setIsLoading(false), 4500);

    // 3. Progress Counter
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 2; // Faster count
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 1500); // Wait 1.5s at 100%
        return;
      }
      setProgress(currentProgress);
    }, 50);

    return () => {
      clearTimeout(failsafe);
      clearInterval(interval);
    };
  }, []);

  let currentStatus = statusMessages[0];
  if (progress >= 100) currentStatus = statusMessages[4];
  else if (progress >= 75) currentStatus = statusMessages[3];
  else if (progress >= 50) currentStatus = statusMessages[2];
  else if (progress >= 25) currentStatus = statusMessages[1];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-[#020305] flex flex-col items-center justify-center overflow-hidden h-[100dvh]"
        >
          {/* ─── CSS MATRIX RAIN BACKGROUND (Now always visible) ─── */}
          <div className="absolute inset-0 flex justify-center gap-2 md:gap-6 overflow-hidden opacity-30 pointer-events-none">
            {columns.map((col, i) => (
              <div
                key={i}
                className="matrix-column font-data text-[10px] md:text-sm text-ice break-all select-none whitespace-nowrap"
                style={{
                  animationDuration: `${col.duration}s`,
                  animationDelay: `${col.delay}s`,
                  maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                }}
              >
                {col.text}
              </div>
            ))}
          </div>

          {/* ─── CRT SCANLINE OVERLAY ─── */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-40" />

          {/* Central Glow behind the ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-ice/10 rounded-full blur-[80px] z-0" />

          {/* ─── CENTER HUD ─── */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-6">
            
            {/* SVG Ring */}
            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke={isComplete ? "#A3E635" : "url(#gradient)"}
                  strokeWidth={isComplete ? "3" : "2"} 
                  strokeDasharray="301.59" 
                  strokeDashoffset={301.59 - (301.59 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                  style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.5))" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A3E635" />
                  </linearGradient>
                </defs>
              </svg>
              
              <motion.div 
                animate={{ rotate: isComplete ? 720 : 360 }}
                transition={{ duration: isComplete ? 1 : 15, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-2 rounded-full border border-dashed ${isComplete ? "border-lime/40" : "border-ice/20"}`}
              />

              {/* Number Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <div className="flex items-baseline gap-1">
                  <span className={`font-shout font-black text-[75px] md:text-[90px] leading-none tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-lime" : "text-paper"}`}>
                    {progress.toString().padStart(3, "0")}
                  </span>
                  <span className={`font-data text-xl transition-colors duration-300 ${isComplete ? "text-lime" : "text-ice"}`}>%</span>
                </div>
              </div>
            </div>

            {/* Status Message Terminal */}
            <div className="mt-12 flex flex-col items-center gap-3 text-center bg-[#020305]/80 px-6 py-3 rounded-xl backdrop-blur-md border border-white/5 shadow-2xl">
              <motion.p 
                key={currentStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-data text-[10px] md:text-xs tracking-[0.2em] uppercase flex items-center gap-3 transition-colors duration-300 ${
                  isComplete ? "text-lime font-bold" : progress >= 75 ? "text-violet" : "text-ice"
                }`}
              >
                <span className={`w-2 h-2 rounded-full animate-ping ${isComplete ? "bg-lime" : "bg-ice"}`} />
                {currentStatus}
              </motion.p>
            </div>
          </div>

          {/* Decorative HUD Brackets */}
          <div className={`absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/10"} z-20`} />
          <div className={`absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/10"} z-20`} />
          
          <div className="absolute top-8 right-8 font-data text-[9px] text-ice/40 tracking-[0.3em] z-20 hidden md:block">
            {site.name.toUpperCase()} // SECURE TERMINAL
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}