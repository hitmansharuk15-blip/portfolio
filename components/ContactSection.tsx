"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { site } from "@/lib/data";
import { ArrowUpRight, Copy, CheckCircle2, Mail } from "lucide-react";

// Custom SVG Icons for brands
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null); // <-- FIXED HERE

  // Calculate the year safely after the component mounts
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-32 bg-deep overflow-hidden border-t border-glass-border flex flex-col justify-center min-h-[90vh]">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-signal relative z-10 text-center flex flex-col items-center">
        
        <p className="meta text-ice mb-8">CHAPTER 05 — TRANSMIT</p>
        
        <h2 className="text-section max-w-4xl mx-auto mb-12">
          Your next <span className="font-voice text-ice lowercase tracking-normal text-[1.1em]">idea</span><br />
          could start here.
        </h2>

        {/* Let's Talk Button */}
        <motion.a 
          href={`mailto:${site.email}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 bg-paper text-ink px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-lime mb-16"
        >
          Let's Talk
          <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.a>

        {/* Contact Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          
          {/* Copy Email Button */}
          <button 
            onClick={copyEmail}
            className="group flex items-center gap-3 text-muted hover:text-paper transition-colors"
            aria-label="Copy email address"
          >
            <Mail size={20} className="text-ice" />
            <span className="font-data text-sm tracking-wider">{site.email}</span>
            {copied ? (
              <CheckCircle2 size={18} className="text-lime" />
            ) : (
              <Copy size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a 
              href={site.socials.find(s => s.platform === 'github')?.href || "#"} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 text-muted hover:text-paper transition-colors group"
              aria-label="GitHub"
            >
              <GithubIcon size={22} className="group-hover:scale-110 transition-transform" />
              <span className="meta hidden md:block">GitHub</span>
            </a>
            
            <a 
              href={site.socials.find(s => s.platform === 'linkedin')?.href || "#"} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 text-muted hover:text-paper transition-colors group"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={22} className="group-hover:scale-110 transition-transform" />
              <span className="meta hidden md:block">LinkedIn</span>
            </a>

            <a 
              href={site.socials.find(s => s.platform === 'instagram')?.href || "#"} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 text-muted hover:text-paper transition-colors group"
              aria-label="Instagram"
            >
              <InstagramIcon size={22} className="group-hover:scale-110 transition-transform" />
              <span className="meta hidden md:block">Instagram</span>
            </a>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-glass-border/50 py-6">
        <div className="container-signal flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 👇 USES SAFE YEAR VARIABLE NOW 👇 */}
          <p className="meta">© {currentYear || 2025} {site.name.toUpperCase()}</p>
          <p className="meta">DESIGNED & BUILT BY {site.name.toUpperCase()}</p>
        </div>
      </div>
    </section>
  );
}