"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site, chapters } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SoundToggle } from "@/components/SoundToggle";
import { playTick } from "@/lib/audio";
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const checkMute = () => setIsMuted(localStorage.getItem("site-muted") !== "false");
    checkMute();
    window.addEventListener("sound-toggled", checkMute);
    return () => window.removeEventListener("sound-toggled", checkMute);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const openCommandMenu = () => {
    playTick(isMuted);
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true });
    document.dispatchEvent(event);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center transition-all duration-300">
        
        {/* 1. LEFT: Monogram Logo */}
        <a 
          href="#hero" 
          onClick={() => playTick(isMuted)}
          className="font-shout font-bold text-xl border border-glass-border w-12 h-12 flex items-center justify-center rounded-lg glass hover:rotate-90 transition-transform duration-300 z-50"
        >
          {site.monogram}
        </a>

        {/* 2. CENTER: Desktop Navigation */}
        <nav 
          className={cn(
            "hidden md:flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 absolute left-1/2 -translate-x-1/2",
            isScrolled ? "glass shadow-lg" : "bg-transparent"
          )}
        >
          {chapters.slice(1).map((chapter) => (
            <a 
              key={chapter.id} 
              href={`#${chapter.id}`} 
              onClick={() => playTick(isMuted)}
              className="px-4 py-1.5 text-sm font-medium text-muted hover:text-paper transition-colors rounded-full relative group"
            >
              {chapter.slug}
              <span className="absolute inset-0 bg-glass-border opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 -z-10" />
            </a>
          ))}
        </nav>

        {/* 3. RIGHT: Actions */}
        <div className="flex items-center gap-2 md:gap-3 z-50">
          
          {/* Command Menu Button (Shows on Mobile as Icon, Desktop as pill) */}
          <button 
            onClick={openCommandMenu}
            className="flex items-center gap-2 px-3 h-10 rounded-full glass text-muted hover:text-paper hover:border-ice/50 transition-all group"
            aria-label="Open System Console"
          >
            <Terminal size={16} className="group-hover:text-ice transition-colors" />
            <span className="hidden md:inline text-xs font-data bg-glass border border-glass-border px-1.5 py-0.5 rounded shadow-sm">K</span>
          </button>

          {/* Hide these on mobile, show on desktop */}
          <div className="hidden md:flex items-center gap-3">
            <SoundToggle />
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden glass w-10 h-10 flex items-center justify-center rounded-full text-paper"
            onClick={() => {
              setIsOpen(!isOpen);
              playTick(isMuted);
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl flex flex-col justify-center px-6"
          >
            <nav className="flex flex-col gap-6">
              {chapters.slice(1).map((chapter, i) => (
                <motion.a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    playTick(isMuted);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="text-4xl font-shout uppercase text-paper hover:text-ice transition-colors flex items-center gap-4"
                >
                  <span className="meta">{chapter.index}</span>
                  {chapter.slug}
                </motion.a>
              ))}
            </nav>

            {/* Mobile Settings (Sound & Theme) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-16 flex items-center gap-4 border-t border-glass-border pt-8"
            >
              <p className="meta text-muted">SYSTEM CONFIG</p>
              <div className="flex gap-3 ml-auto">
                <SoundToggle />
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}