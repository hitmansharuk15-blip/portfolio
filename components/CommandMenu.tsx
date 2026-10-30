"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/data";
import { 
  ArrowRight, Copy, CheckCircle2, Mail, User, FolderGit2, 
  Briefcase, Sun, Volume2, VolumeX, Terminal, Sparkles
} from "lucide-react";
import { playTick } from "@/lib/audio";

// Custom SVGs for brands
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

// 👇 NEW INSTAGRAM ICON 👇
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Sync with local storage
    const checkMute = () => setIsMuted(localStorage.getItem("site-muted") !== "false");
    const checkTheme = () => setIsLight(localStorage.getItem("theme") === "light");
    
    checkMute();
    checkTheme();

    window.addEventListener("sound-toggled", checkMute);
    window.addEventListener("theme-toggled", checkTheme);

    // Toggle the menu when ⌘K or Ctrl+K is pressed
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        playTick(isMuted);
      }
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("sound-toggled", checkMute);
      window.removeEventListener("theme-toggled", checkTheme);
    };
  }, [isMuted]);

  // Actions
  const scrollToSection = (id: string) => {
    setOpen(false);
    playTick(isMuted);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(site.email);
    setCopied(true);
    playTick(isMuted);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    playTick(isMuted);
    const newMode = !isLight;
    setIsLight(newMode);
    if (newMode) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
    window.dispatchEvent(new Event("theme-toggled"));
    setOpen(false);
  };

  const toggleSound = () => {
    const newMute = !isMuted;
    playTick(false); // Force play before muting
    setIsMuted(newMute);
    localStorage.setItem("site-muted", String(newMute));
    window.dispatchEvent(new Event("sound-toggled"));
    setOpen(false);
  };

  const triggerEasterEgg = () => {
    setOpen(false);
    playTick(isMuted);
    
    document.documentElement.classList.add("glitch-mode");
    
    setTimeout(() => {
      document.documentElement.classList.remove("glitch-mode");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Blurred Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[100]"
          />

          {/* Terminal-style Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-[101]"
          >
            {/* Outer glow container */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-ice/50 via-violet/20 to-transparent rounded-2xl blur-sm opacity-50" />
            
            <Command className="relative glass bg-ink/95 rounded-2xl border border-ice/20 overflow-hidden text-paper shadow-[0_0_40px_rgba(34,211,238,0.1)]">
              
              {/* Fake Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-glass border-b border-glass-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-data text-muted">
                  <Terminal size={12} /> SYSTEM_CONSOLE v1.0
                </div>
              </div>

              <div className="flex items-center px-4 border-b border-glass-border">
                <ArrowRight size={16} className="text-ice mr-3" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent py-4 text-sm font-data outline-none placeholder:text-muted/50"
                />
                <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-data bg-glass border border-glass-border px-2 py-1 rounded text-muted">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-6 text-center text-sm font-data text-muted">
                  &gt; Command not found...
                </Command.Empty>

                {/* NAVIGATE */}
                <Command.Group heading=">_ NAVIGATE" className="text-[10px] font-data text-ice/70 px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={() => scrollToSection("about")}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-ice/10 data-[selected=true]:text-ice transition-colors"
                  >
                    <User size={16} /> About Me
                  </Command.Item>
                  <Command.Item
                    onSelect={() => scrollToSection("projects")}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-ice/10 data-[selected=true]:text-ice transition-colors"
                  >
                    <FolderGit2 size={16} /> Projects
                  </Command.Item>
                  <Command.Item
                    onSelect={() => scrollToSection("journey")}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-ice/10 data-[selected=true]:text-ice transition-colors"
                  >
                    <Briefcase size={16} /> Journey
                  </Command.Item>
                </Command.Group>

                {/* SYSTEM ACTIONS */}
                <Command.Group heading=">_ SYSTEM ACTIONS" className="text-[10px] font-data text-violet/70 px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={toggleTheme}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-violet/10 data-[selected=true]:text-violet transition-colors"
                  >
                    <Sun size={16} /> Switch to {isLight ? "Dark" : "Light"} Mode
                  </Command.Item>
                  <Command.Item
                    onSelect={toggleSound}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-violet/10 data-[selected=true]:text-violet transition-colors"
                  >
                    {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />} 
                    {isMuted ? "Enable Audio" : "Mute Audio"}
                  </Command.Item>
                  <Command.Item
                    onSelect={copyEmail}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-violet/10 data-[selected=true]:text-violet transition-colors"
                  >
                    <Mail size={16} /> 
                    {copied ? "Email Copied!" : "Copy Email Address"}
                    {copied && <CheckCircle2 size={14} className="text-lime ml-auto" />}
                  </Command.Item>
                </Command.Group>

                {/* LINKS */}
                <Command.Group heading=">_ EXTERNAL_LINKS" className="text-[10px] font-data text-lime/70 px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={() => { window.open("https://github.com/hitmansharuk15-blip", "_blank"); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-lime/10 data-[selected=true]:text-lime transition-colors"
                  >
                    <GithubIcon /> GitHub Profile
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { window.open("https://linkedin.com/in/YOUR-USERNAME", "_blank"); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-lime/10 data-[selected=true]:text-lime transition-colors"
                  >
                    <LinkedinIcon /> LinkedIn Profile
                  </Command.Item>
                  
                  {/* 👇 NEW INSTAGRAM COMMAND 👇 */}
                  <Command.Item
                    onSelect={() => { window.open("https://www.instagram.com/itz__sharuk__32?exln=MWZsajZpMHI2azkzMw==", "_blank"); setOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-lime/10 data-[selected=true]:text-lime transition-colors"
                  >
                    <InstagramIcon /> Instagram Profile
                  </Command.Item>
                </Command.Group>

                {/* SECRET EASTER EGG */}
                <Command.Group heading=">_ RESTRICTED" className="text-[10px] font-data text-muted px-2 py-1 mt-4 opacity-50 hover:opacity-100 transition-opacity">
                  <Command.Item
                    onSelect={triggerEasterEgg}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer data-[selected=true]:bg-paper/10 data-[selected=true]:text-paper transition-colors"
                  >
                    <Sparkles size={16} /> Execute: Matrix_Glitch
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Terminal Footer */}
              <div className="bg-glass px-4 py-2 text-[10px] font-data text-muted flex justify-between items-center border-t border-glass-border">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}