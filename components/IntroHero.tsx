"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/data";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { ScrambleText } from "@/components/ScrambleText";
import { playTick } from "@/lib/audio";

export function IntroHero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // --- AUDIO HOOKS ---
  const [isMuted, setIsMuted] = useState(true);
  
  useEffect(() => {
    const checkMute = () => setIsMuted(localStorage.getItem("site-muted") !== "false");
    checkMute();
    window.addEventListener("sound-toggled", checkMute);
    return () => window.removeEventListener("sound-toggled", checkMute);
  }, []);
  // ------------------------------------------------

  // Cycle roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % site.roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Mouse spotlight (desktop only)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Magnetic CTA effect
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden grain">
      
      {/* 👇 GIANT BACKGROUND NAME WATERMARK 👇 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-[28vw] md:text-[22vw] font-shout font-black uppercase text-paper whitespace-nowrap leading-none tracking-tighter"
        >
          {site.name.split(" ").slice(1).join(" ") || "S"}
        </motion.h2>
      </div>

      {/* Mouse Spotlight */}
      {mousePos.x !== 0 && (
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 77, 255, 0.07), transparent 40%)`
          }}
        />
      )}

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container-signal relative z-10 pt-20">
        
        {/* Top label */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="meta mb-6"
        >
          HELLO, WORLD. — TRANSMISSION 001
        </motion.p>

                {/* Enormous Name with Scramble Effect & Glitch Hover */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-hero flex flex-col"
        >
          {/* 👇 Wrapped in the glitch hover class 👇 */}
          <div className="glitch-text-hover cursor-crosshair w-fit">
            <ScrambleText text={site.firstName} />
          </div>
          <span className="text-muted glitch-text-hover cursor-crosshair w-fit">
            <ScrambleText text={site.name.split(" ").slice(1).join(" ") || ""} />
          </span>
        </motion.h1>
        
        {/* Role Cycler & Availability */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center gap-8">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            <span className="meta text-paper/80">
              {site.availability.toUpperCase()}
            </span>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-12 h-[1px] bg-glass-border" />

          {/* Role Cycler */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-6 overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIndex}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-data text-ice tracking-widest text-sm absolute"
              >
                {site.roles[roleIndex].toUpperCase()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-wrap items-center gap-6"
        >
          {/* Magnetic Primary CTA */}
          <a 
            href="#about"
            ref={buttonRef}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            onMouseEnter={() => playTick(isMuted)}
            className="group relative flex items-center gap-3 bg-paper text-ink px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:bg-lime"
          >
            Explore My World
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </a>

          {/* Secondary CTA */}
          <a 
            href="#contact"
            onMouseEnter={() => playTick(isMuted)}
            className="group relative font-data text-xs uppercase tracking-widest text-muted hover:text-paper transition-colors pb-1"
          >
            Let's Connect
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-muted group-hover:bg-paper scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="meta text-[10px]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}