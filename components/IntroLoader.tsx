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
    console.log("[IntroLoader] 🚀 Component mounted. Starting boot sequence...");

    // 🎯 Use requestAnimationFrame for smooth, reliable animation
    let startTime: number | null = null;
    const duration = 3000; // Total loading time in ms (3 seconds)
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        console.log("[IntroLoader] ✅ Reached 100%. Showing ACCESS GRANTED.");
        setIsComplete(true);
        
        // Wait 1.5s to show "ACCESS GRANTED", then close the loader
        setTimeout(() => {
          console.log("[IntroLoader] 🎬 Closing loader...");
          setIsLoading(false);
        }, 1500);
        return; // Stop the animation loop
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Glitch background text
    const glitchInterval = setInterval(() => {
      setGlitchText(
        Array.from({ length: 40 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("")
      );
    }, 50);

    return () => {
      console.log("[IntroLoader] 🧹 Cleanup");
      cancelAnimationFrame(animationFrameId);
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
          className="fixed inset-0 z-[200] bg-[#030407] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,228,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,228,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Glitch Text Background */}
          {!isComplete && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 font-data text-4xl md:text-8xl tracking-[1em] text-ice break-all select-none overflow-hidden">
              {glitchText}
            </div>
          )}

          {/* Center HUD */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-6">
            
            {/* SVG Ring */}
            <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] flex items-center justify-center">
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
                  <span className={`font-shout font-black text-[80px] md:text-[100px] leading-none tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-lime" : "text-paper"}`}>
                    {progress.toString().padStart(3, "0")}
                  </span>
                  <span className={`font-data text-xl md:text-2xl transition-colors duration-300 ${isComplete ? "text-lime" : "text-ice"}`}>%</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-12 flex flex-col items-center gap-2 text-center">
              <motion.p 
                key={currentStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-data text-xs md:text-sm tracking-widest uppercase flex items-center gap-2 transition-colors duration-300 ${
                  isComplete ? "text-lime font-bold" : progress >= 75 ? "text-violet" : "text-ice"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isComplete ? "bg-lime" : "bg-ice"}`} />
                {currentStatus}
              </motion.p>
              
              <p className="font-data text-[9px] text-muted tracking-widest">
                {isComplete ? "REDIRECTING TO MAINFRAME..." : `SECURE CONNECTION // ${site.monogram}_OS`}
              </p>
            </div>
          </div>

          {/* Decorative Brackets */}
          <div className={`absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/20"}`} />
          <div className={`absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 transition-colors duration-500 ${isComplete ? "border-lime" : "border-white/20"}`} />
          
          <div className="absolute bottom-8 left-8 font-data text-[10px] text-muted tracking-widest hidden md:block">
            SYS.BOOT_SEQUENCE_INIT
          </div>

          <div className="absolute top-8 right-8 font-data text-[10px] text-muted tracking-widest hidden md:block">
            {site.name.toUpperCase()} © {new Date().getFullYear()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}