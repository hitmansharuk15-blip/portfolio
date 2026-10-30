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
        color: i % 3 === 0 ? "text-orange-500" : i % 3 === 1 ? "text-pink-600" : "text-red-500",
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
          className="fixed inset-0 z-[200] bg-[#0A0304] flex flex-col items-center justify-center overflow-hidden h-[100dvh]"
        >
          {/* Background Data Streams */}
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

          {/* Fading Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0304] via-transparent to-[#0A0304] pointer-events-none z-10" />
          <div className="absolute inset-0 crt-overlay pointer-events-none z-10 opacity-30" />

          {/* Central Hellfire Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full blur-[80px] z-0 transition-colors duration-500 ${isComplete ? "bg-lime-500/10" : "bg-orange-600/20"}`} />

          {/* ─── HEXAGON REACTOR CORE ─── */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-6">
            
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] flex items-center justify-center">
              
              {/* Outer rotating dashed hexagon */}
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-full h-full opacity-30" 
                viewBox="0 0 100 100"
              >
                <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="#FF8C00" strokeWidth="0.5" strokeDasharray="2 2" />
              </motion.svg>

              {/* Main SVG Hexagon Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Hexagon */}
                <polygon 
                  points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="1" 
                />
                {/* Progress Hexagon (pathLength=100 makes it easy to track progress 0-100) */}
                <motion.polygon 
                  points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
                  fill="none" 
                  stroke={isComplete ? "#A3E635" : "url(#fireGradient)"}
                  strokeWidth={isComplete ? "3" : "2"} 
                  pathLength="100"
                  strokeDasharray="100" 
                  strokeDashoffset={100 - progress}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                  style={{ filter: "drop-shadow(0 0 10px rgba(255,140,0,0.6))" }}
                />
                <defs>
                  <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF0055" />
                    <stop offset="50%" stopColor="#FF8C00" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Orbiting Node (Following the hexagon progress) */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ transform: `rotate(${progress * 3.6}deg)` }}
              >
                <div className={`absolute top-[1%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-colors duration-300 ${isComplete ? "bg-lime-400 shadow-[0_0_15px_#A3E635]" : "bg-orange-500 shadow-[0_0_15px_#FF8C00]"}`} />
              </div>

              {/* Inner Pulsing Core */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-40 h-40 md:w-48 md:h-48 rounded-full border flex items-center justify-center transition-colors duration-500 ${
                  isComplete ? "border-lime-500/30 bg-lime-500/5" : "border-orange-500/30 bg-orange-500/5"
                }`}
              >
                
                {/* Number Counter */}
                <div className="flex items-baseline gap-1 drop-shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                  <span className={`font-shout font-black text-[60px] md:text-[80px] leading-none tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-lime-400" : "text-white"}`}>
                    {progress.toString().padStart(3, "0")}
                  </span>
                  <span className={`font-data text-lg md:text-xl transition-colors duration-300 ${isComplete ? "text-lime-400" : "text-orange-500"}`}>%</span>
                </div>

              </motion.div>

              {/* Decorative corner triangles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-500/50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-orange-500/50" />

            </div>

            {/* Status Message Terminal */}
            <div className="mt-12 flex flex-col items-center gap-3 text-center bg-[#0A0304]/90 px-6 py-3 rounded-xl backdrop-blur-md border border-orange-500/20 shadow-[0_0_30px_rgba(255,140,0,0.1)]">
              <motion.p 
                key={currentStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-data text-[10px] md:text-xs tracking-[0.2em] uppercase flex items-center gap-3 transition-colors duration-300 ${
                  isComplete ? "text-lime-400 font-bold" : progress >= 75 ? "text-pink-500" : "text-orange-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full animate-ping ${isComplete ? "bg-lime-400" : "bg-orange-500"}`} />
                {currentStatus}
              </motion.p>
            </div>
          </div>

          {/* Decorative HUD Brackets */}
          <div className={`absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 transition-colors duration-500 ${isComplete ? "border-lime-500" : "border-orange-500/30"} z-20`} />
          <div className={`absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 transition-colors duration-500 ${isComplete ? "border-lime-500" : "border-orange-500/30"} z-20`} />
          
          <div className="absolute top-6 right-6 font-data text-[8px] md:text-[9px] text-orange-500/40 tracking-[0.3em] z-20 hidden md:block">
            {site.name.toUpperCase()} // REACTOR_CORE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}