"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { site, interests } from "@/lib/data";
import { MapPin, GraduationCap, Crosshair } from "lucide-react";

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect for the image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="about" className="relative py-32 bg-deep overflow-hidden border-t border-glass-border" ref={containerRef}>
      <div className="container-signal relative z-10">
        
        {/* Section Header */}
        <div className="mb-20">
          <p className="meta text-ice mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-ice/50" />
            CHAPTER 01 — IDENTITY
          </p>
          
          <h2 className="text-section max-w-4xl">
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

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Story & Meta */}
          <div className="flex flex-col gap-12">
            <div className="space-y-6 text-lg text-muted leading-relaxed">
              {site.story.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Meta Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-glass-border"
            >
              <div className="flex flex-col gap-2">
                <span className="meta flex items-center gap-2"><MapPin size={12}/> Location</span>
                <span className="font-shout text-paper">{site.location}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="meta flex items-center gap-2"><GraduationCap size={12}/> Education</span>
                <span className="font-shout text-paper">{site.education}</span>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <span className="meta flex items-center gap-2"><Crosshair size={12}/> Focus</span>
                <span className="font-shout text-paper">{site.focus}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Image & Floating Card */}
          <div className="relative">
                    {/* Portrait (Parallax) */}
            <motion.div 
              style={{ y }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-ink border border-glass-border group"
            >
              {/* 1. Your Actual Image */}
              <Image
                src="/profile.jpeg"
                alt={`Portrait of ${site.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              
              {/* 2. Duotone Color Overlay (Violet/Ice tint) */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet/30 to-ice/10 mix-blend-color z-10 pointer-events-none" />
              
              {/* 3. Dark Fade at the bottom so the floating card pops */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent z-20 pointer-events-none" />
            </motion.div>
            {/* Floating Interests Card */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-8 -left-4 sm:-left-12 glass p-6 rounded-xl max-w-[280px] z-30 shadow-2xl"
            >
              <p className="meta text-paper mb-4">PERSONAL INTERESTS</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span 
                    key={i} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/50 border border-glass-border rounded-full text-xs font-shout text-muted hover:text-paper hover:border-paper/30 transition-colors cursor-default"
                  >
                    <span className="opacity-70">{interest.emoji}</span>
                    {interest.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}