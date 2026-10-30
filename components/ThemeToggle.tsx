"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { playTick } from "@/lib/audio"; // <-- IMPORTED

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const isLightMode = localStorage.getItem("theme") === "light";
    setIsLight(isLightMode);
    if (isLightMode) document.documentElement.classList.add("light");
  }, []);

  const toggleTheme = () => {
    // Check if the user has sound muted before playing
    const isMuted = localStorage.getItem("site-muted") !== "false";
    playTick(isMuted); // <-- PLAYS SOUND

    const newMode = !isLight;
    setIsLight(newMode);
    if (newMode) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full glass flex items-center justify-center text-paper hover:scale-110 transition-transform"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isLight ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {isLight ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </button>
  );
}