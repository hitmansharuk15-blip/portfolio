"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { site, interests } from "@/lib/data";
import { MapPin, GraduationCap, Crosshair, Fingerprint, ArrowUpRight } from "lucide-react";
import { playTick } from "@/lib/audio";

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]); 

  const [isMuted, setIsMuted] = useState(true);
  useEffect(() => {
    const checkMute = () => setIsMuted(localStorage.getItem("site-muted") !== "false");
    checkMute();
    window.addEventListener("sound-toggled", checkMute);
    return () => window.removeEventListener("sound-toggled", checkMute);
  }, []);

  return (
    <section id="about" className="relative py-32 bg-deep overflow-hidden border-t border-glass-border" ref={containerRef}>
      
      {/* Giant Background Watermark */}
      <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.02]">
        <h2 className="text-[20vw] font-shout font-black uppercase tracking-tighter text-paper whitespace-nowrap">
          IDENTITY
        </h2>
      </div>

      <div className="container-signal relative z-10">
        
        {/* Editorial Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-glass-border pb-8">
          <div>
            <p className="meta text-ice mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-ice/50" />
              CHAPTER 01 — IDENTITY
            </p>
            <h2 className="text-section max-w-2xl">
              I don't just write code.<br />
              I create{" "}
              <motion.span 
                initial={{ opacity: 0, fontStyle: "normal" }}
                whileInView={{ opacity: 1, fontStyle: "italic" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-voice text-ice lowercase tracking-normal text-[1.1em] inline-block"
              >
                experiences
              </motion.span>
              .
            </h2>
          </div>
          <div className="flex items-center gap-2 text-ice/50 hidden md:flex">
            <Fingerprint size={32} strokeWidth={1} />
            <div className="flex flex-col">
              <span className="font-data text-[10px] tracking-widest">BIOMETRIC_SCAN</span>
              <span className="font-data text-[10px] tracking-widest text-lime animate-pulse">MATCH_FOUND</span>
            </div>
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Card 1: The Image (Tall) */}
          <div className="md:col-span-1 md:row-span-2 relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden border border-glass-border group">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[110%] -top-[5%]">
              <Image
                src="/profile.jpeg"
                alt={`Portrait of ${site.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-[center_25%] transition-transform duration-1000 group-hover:scale-105"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />
            
            {/* Image Overlay Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="meta text-ice mb-1">CURRENTLY</p>
              <p className="font-shout font-bold text-paper text-xl">{site.availability}</p>
            </div>
          </div>

          {/* Card 2: The Bio (Wide) */}
          <div className="md:col-span-2 glass rounded-3xl p-8 md:p-12 border border-glass-border relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <span className="font-shout font-black text-8xl">01</span>
            </div>
            <h3 className="font-data text-xs text-ice tracking-widest mb-6">SUBJECT_OVERVIEW</h3>
            <div className="space-y-6 text-lg md:text-xl text-muted leading-relaxed font-light">
              {site.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Card 3: Meta Details (Grid) */}
          <div className="md:col-span-1 glass rounded-3xl p-8 border border-glass-border flex flex-col justify-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-ice" />
                <span className="font-data text-[10px] text-muted tracking-widest">LOCATION</span>
              </div>
              <p className="font-shout font-bold text-paper">{site.location}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={16} className="text-ice" />
                <span className="font-data text-[10px] text-muted tracking-widest">EDUCATION</span>
              </div>
              <p className="font-shout font-bold text-paper">{site.education}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crosshair size={16} className="text-lime" />
                <span className="font-data text-[10px] text-muted tracking-widest">FOCUS</span>
              </div>
              <p className="font-shout font-bold text-paper">{site.focus}</p>
            </div>
          </div>

          {/* Card 4: RPG Stats (Compact) */}
          <div className="md:col-span-1 glass rounded-3xl p-8 border border-glass-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-glass-border pb-4">
              <span className="font-data text-[10px] text-ice tracking-widest">TRAITS</span>
              <span className="font-data text-[10px] text-muted">LVL.99</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span 
                  key={i}
                  onMouseEnter={() => playTick(isMuted)}
                  className="px-3 py-1.5 bg-ink/50 border border-glass-border rounded-lg text-xs font-shout font-bold text-muted hover:text-ice hover:border-ice/50 transition-colors cursor-crosshair flex items-center gap-2"
                >
                  <span>{interest.emoji}</span>
                  {interest.label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}