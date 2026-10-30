"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/data";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

const generateRandomText = (length: number) => {
  return Array.from({ length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");
};

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const statusMessages = [
    "ESTABLISHING CONNECTION...",
    "BYPASSING SECURITY...",
    "DECRYPTING PROFILE...",
    `IDENTITY CONFIRMED: ${site.firstName.toUpperCase()}`,
    "ACCESS GRANTED",
  ];

  // Generate 12 unique lines of scrolling data ONCE
  const streams = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      return {
        text: generateRandomText(100),
        duration: Math.random() * 10 + 10,
        direction: isLeft ? "data-stream-left" : "data-stream-right",
        top: `${(i / 12) * 100}%`,
        opacity: Math.random() * 0.2 + 0.05,
        size: Math.random() > 0.5 ? "text-[10px]" : "text-[14px]",
        color: i % 3 === 0 ? "text-ice" : i % 3 === 1 ? "text-violet" : "text-paper",
      };
    });
  }, []);

  useEffect(() => {
    const failsafe = setTimeout(() => setIsLoading(false), 4500);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 1500);
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
          {/* Background Data Streams (Mobile Friendly) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {streams.map((stream, i) => (
              <div
                key={i}
                className="absolute w-full overflow-hidden"
                style={{ top: stream.top, opacity: stream.opacity }}
              >
                <div
                  className={`data-stream ${stream.direction} font-data ${stream.size} ${stream.color}`}
                  style={{ animationDuration: `${stream.duration}s` }}
                >
                  <span className="px-4">{stream.text}</span>
                  <span className="px-4">{stream.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Depth Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020305] via-transparent to-[#020305] pointer-events-none z-10" />
          <div className="absolute inset-0 crt-overlay pointer-events-none z-10 opacity-30" />

          {/* Central Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full blur-[80px] z-0 transition-colors duration-500 ${isComplete ? "bg-lime/10" : "bg-ice/10"}`} />

          {/* ─── UNIQUE CYBERNETIC TARGETING CORE ─── */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-6">
            
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] flex items-center justify-center">
              
              {/* 1. Static Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              
              {/* 2. Fast Spinning Dashed Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-dashed border-ice/20"
              />

              {/* 3. Slow Spinning Outer Dots */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-violet/10"
              >
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-violet rounded-full shadow-[0_0_10px_#8B5CF6]" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-violet rounded-full shadow-[0_0_10px_#8B5CF6]" />
              </motion.div>

              {/* 4. Crosshairs (Targeting Lines) */}
              <div className="absolute inset-x-[-20px] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-ice/20 to-transparent pointer-events-none" />
              <div className="absolute inset-y-[-20px] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-ice/20 to-transparent pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-ice/10 rounded-full pointer-events-none" />

              {/* 5. SVG Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke={isComplete ? "#A3E635" : "url(#gradient)"}
                  strokeWidth={isComplete ? "3" : "2"} 
                  strokeDasharray="301.59" 
                  strokeDashoffset={301.59 - (301.59 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                  style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.5))" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A3E635" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 6. Orbiting Glowing Node (Follows the progress) */}
              <div 
                className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2 pointer-events-none"
                style={{ transform: `rotate(${progress * 3.6}deg)` }}
              >
                <div className={`absolute top-[2px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-colors duration-300 ${isComplete ? "bg-lime shadow-[0_0_15px_#A3E635]" : "bg-ice shadow-[0_0_15px_#22D3EE]"}`} />
              </div>

              {/* 7. Inner Core (Pulsing) */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-40 h-40 md:w-48 md:h-48 rounded-full border flex items-center justify-center transition-colors duration-500 ${isComplete ? "border-lime/30 bg-lime/5" : "border-ice/20 bg-ice/5"}`}
              >
                
                {/* Massive Number Counter */}
                <div className="flex items-baseline gap-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <span className={`font-shout font-black text-[65px] md:text-[85px] leading-none tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-lime" : "text-paper"}`}>
                    {progress.toString().padStart(3, "0")}
                  </span>
                  <span className={`font-data text-lg md:text-xl transition-colors duration-300 ${isComplete ? "text-lime" : "text-ice"}`}>%</span>
                </div>

              </motion.div>

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
          <div className={`absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/10"} z-20`} />
          <div className={`absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/10"} z-20`} />
          
          <div className="absolute top-6 right-6 font-data text-[8px] md:text-[9px] text-ice/40 tracking-[0.3em] z-20 hidden md:block">
            {site.name.toUpperCase()} // SECURE TERMINAL
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}