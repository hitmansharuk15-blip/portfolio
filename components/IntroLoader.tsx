"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/data";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [glitchText, setGlitchText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const statusMessages = [
    "ESTABLISHING CONNECTION...",
    "BYPASSING SECURITY...",
    "DECRYPTING PROFILE...",
    `IDENTITY CONFIRMED: ${site.firstName.toUpperCase()}`,
    "ACCESS GRANTED",
  ];

  useEffect(() => {
    // 🚨 FAILSAFE: If the browser freezes, force close the loader after 4.5 seconds anyway.
    const failsafe = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    // We use setInterval instead of requestAnimationFrame because 
    // mobile browsers are much more reliable with intervals.
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 3) + 1; // +1, +2, or +3
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsComplete(true);
        clearInterval(interval);
        
        // Show "ACCESS GRANTED" for 1 second, then close
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        
        return;
      }
      
      setProgress(currentProgress);
    }, 30);

    // Glitch background text
    const glitchInterval = setInterval(() => {
      setGlitchText(
        Array.from({ length: 30 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("")
      );
    }, 60);

    return () => {
      clearTimeout(failsafe);
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  // Determine status message
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
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          // 👇 CHANGED TO h-[100dvh] for mobile stability
          className="fixed inset-0 z-[200] bg-[#030407] flex flex-col items-center justify-center overflow-hidden h-[100dvh]"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,228,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,228,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Glitch Text Background */}
          {!isComplete && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 font-data text-4xl tracking-[1em] text-ice break-all select-none overflow-hidden">
              {glitchText}
            </div>
          )}

          {/* Center HUD */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-6">
            
            {/* SVG Ring */}
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke={isComplete ? "#A3E635" : "url(#gradient)"}
                  strokeWidth={isComplete ? "2.5" : "1.5"} 
                  strokeDasharray="301.59" 
                  strokeDashoffset={301.59 - (301.59 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
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
                transition={{ duration: isComplete ? 1 : 10, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-4 rounded-full border border-dashed ${isComplete ? "border-lime/50" : "border-white/10"}`}
              />

              {/* Number Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                  <span className={`font-shout font-black text-[70px] leading-none tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-lime" : "text-paper"}`}>
                    {progress.toString().padStart(3, "0")}
                  </span>
                  <span className={`font-data text-xl transition-colors duration-300 ${isComplete ? "text-lime" : "text-ice"}`}>%</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-10 flex flex-col items-center gap-2 text-center">
              <motion.p 
                key={currentStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-data text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors duration-300 ${
                  isComplete ? "text-lime font-bold" : progress >= 75 ? "text-violet" : "text-ice"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isComplete ? "bg-lime" : "bg-ice"}`} />
                {currentStatus}
              </motion.p>
            </div>
          </div>

          {/* Decorative Brackets */}
          <div className={`absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/20"}`} />
          <div className={`absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/20"}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}