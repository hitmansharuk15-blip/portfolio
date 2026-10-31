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
  // 🚨 FIX: Start with empty array, populate on client only
  const [streams, setStreams] = useState<any[]>([]);

  const statusMessages = [
    "ESTABLISHING CONNECTION...",
    "BYPASSING SECURITY...",
    "DECRYPTING PROFILE...",
    `IDENTITY CONFIRMED: ${site.firstName.toUpperCase()}`,
    "ACCESS GRANTED",
  ];

  // 🚨 FIX: Generate streams only on client (avoids Math.random prerender error)
  useEffect(() => {
    const newStreams = Array.from({ length: 15 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      return {
        text: generateRandomText(120),
        duration: Math.random() * 8 + 8,
        direction: isLeft ? "data-stream-left" : "data-stream-right",
        top: `${(i / 15) * 100}%`,
        opacity: Math.random() * 0.15 + 0.05,
        size: "text-[10px] md:text-xs",
        color: i % 3 === 0 ? "text-[#00FF41]" : i % 3 === 1 ? "text-[#008F11]" : "text-white",
      };
    });
    setStreams(newStreams);
  }, []);

  useEffect(() => {
    const failsafe = setTimeout(() => setIsLoading(false), 5000);
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
    }, 60);
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

  const totalBars = 20;
  const filledBars = Math.floor((progress / 100) * totalBars);
  const emptyBars = totalBars - filledBars;
  const asciiProgress = `[${"█".repeat(filledBars)}${"░".repeat(emptyBars)}]`;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden h-[100dvh] font-mono"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {streams.map((stream, i) => (
              <div
                key={i}
                className="absolute w-full overflow-hidden"
                style={{ top: stream.top, opacity: stream.opacity }}
              >
                <div
                  className={`data-stream ${stream.direction} ${stream.size} ${stream.color}`}
                  style={{ animationDuration: `${stream.duration}s` }}
                >
                  <span className="px-4">{stream.text}</span>
                  <span className="px-4">{stream.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none z-10 opacity-40" style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.6) 50%)", backgroundSize: "100% 4px" }} />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-20 w-[90%] max-w-lg bg-black/80 border border-[#00FF41]/40 shadow-[0_0_50px_rgba(0,255,65,0.15)] rounded-lg overflow-hidden backdrop-blur-sm"
          >
            <div className="bg-[#00FF41]/10 border-b border-[#00FF41]/30 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <p className="text-[#00FF41] text-[10px] tracking-widest">root@mainframe:~#</p>
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center">
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-6xl md:text-8xl font-black tabular-nums tracking-tighter transition-colors duration-300 ${isComplete ? "text-white" : "text-[#00FF41]"}`}>
                  {progress.toString().padStart(3, "0")}
                </span>
                <span className={`text-xl md:text-2xl font-bold ${isComplete ? "text-white" : "text-[#00FF41]"}`}>%</span>
              </div>

              <div className="w-full flex justify-center mb-6">
                <span className={`text-sm md:text-lg tracking-[0.2em] font-bold ${isComplete ? "text-white" : "text-[#00FF41]"}`}>
                  {asciiProgress}
                </span>
              </div>

              <div className="w-full min-h-[40px] flex items-center justify-start border-t border-[#00FF41]/20 pt-4">
                <p className={`text-xs md:text-sm tracking-wider font-bold ${isComplete ? "text-white" : "text-[#00FF41]"}`}>
                  {currentStatus}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className={`inline-block w-2 h-4 ml-1 align-middle ${isComplete ? "bg-white" : "bg-[#00FF41]"}`} />
                </p>
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-6 w-full px-6 flex justify-between z-20 text-[9px] text-[#00FF41]/50 tracking-widest">
            <span>IP: 127.0.0.1</span>
            <span>{site.name.toUpperCase()}_OS</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}