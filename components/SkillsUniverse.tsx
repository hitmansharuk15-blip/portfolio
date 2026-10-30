"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skills, Technology } from "@/lib/data";
import * as Icons from "lucide-react";

// Helper to render the icons dynamically from the string in data.ts
const renderIcon = (iconName?: string) => {
  if (!iconName) return <Icons.Code size={16} />;
  const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
  return IconComponent ? <IconComponent size={16} /> : <Icons.Code size={16} />;
};

export function SkillsUniverse() {
  const [activeTech, setActiveTech] = useState<Technology | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(skills[0].id);

  return (
    <section id="skills" className="relative py-32 bg-ink overflow-hidden border-t border-glass-border">
      <div className="container-signal relative z-10">
        
        {/* Section Header */}
        <div className="mb-20">
          <p className="meta text-ice mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-ice/50" />
            CHAPTER 02 — CAPABILITIES
          </p>
          <h2 className="text-section max-w-4xl">
            The tools behind<br />
            the <span className="font-voice text-ice lowercase tracking-normal text-[1.1em]">craft</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left: Constellation Map (Categories & Tech) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {skills.map((category) => (
              <div key={category.id} className="relative">
                <button 
                  onClick={() => setActiveCategory(category.id)}
                  className="meta text-paper mb-6 flex items-center gap-2 hover:text-ice transition-colors"
                >
                  <span className="w-2 h-2 rounded-full border border-current" />
                  {category.label}
                </button>
                
                <div className="flex flex-wrap gap-3">
                  {category.technologies.map((tech) => (
                    <button
                      key={tech.name}
                      onMouseEnter={() => setActiveTech(tech)}
                      onFocus={() => setActiveTech(tech)}
                      onClick={() => setActiveTech(tech)}
                      className={`
                        group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                        ${activeTech?.name === tech.name 
                          ? "bg-paper text-ink border-paper shadow-[0_0_20px_rgba(232,234,242,0.3)]" 
                          : "bg-glass border-glass-border text-muted hover:border-paper/30 hover:text-paper"}
                      `}
                    >
                      <span className="opacity-70 group-hover:opacity-100">
                        {renderIcon(tech.icon)}
                      </span>
                      <span className="font-shout font-medium text-sm">{tech.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Inspector Panel (Desktop) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-32">
            <div className="glass rounded-2xl p-8 min-h-[300px] relative overflow-hidden flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {activeTech ? (
                  <motion.div
                    key={activeTech.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-ink border border-glass-border flex items-center justify-center mb-6 text-ice">
                      {renderIcon(activeTech.icon)}
                    </div>
                    <h3 className="text-3xl font-shout font-bold text-paper uppercase tracking-tight mb-2">
                      {activeTech.name}
                    </h3>
                    <p className="meta text-ice mb-6">
                      {skills.find(s => s.technologies.some(t => t.name === activeTech.name))?.label}
                    </p>
                    <p className="text-muted leading-relaxed">
                      {activeTech.description}
                    </p>
                    
                    {activeTech.level && (
                      <div className="mt-6 pt-6 border-t border-glass-border flex items-center justify-between">
                        <span className="meta">Experience</span>
                        <span className="font-data text-paper text-sm">{activeTech.level}</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* --- NEW SCI-FI TARGETING HUD --- */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative flex flex-col items-center justify-center h-full w-full min-h-[250px] overflow-hidden rounded-xl"
                  >
                    {/* 1. The Targeting Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(168,228,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,228,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    {/* 2. The Rotating Radar Sweep */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(168,228,255,0.15)_90deg,transparent_90deg)] pointer-events-none"
                    />

                    {/* 3. The Reticle/Target Icon */}
                    <div className="relative z-10 mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border border-ice/20 border-dashed flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Icons.Crosshair size={24} className="text-ice/50" />
                        </motion.div>
                      </motion.div>
                      {/* Decorative corner brackets */}
                      <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-ice/50" />
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-ice/50" />
                    </div>

                    {/* 4. The Terminal Prompt */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <p className="meta text-ice flex items-center gap-2">
                        <span className="w-2 h-2 bg-ice animate-pulse rounded-full" />
                        AWAITING SELECTION
                      </p>
                      <div className="font-data text-xs text-muted flex items-center gap-1">
                        <span className="text-ice/50">{">"}</span>
                        <span>SELECT NODE TO INSPECT</span>
                        <motion.span 
                          animate={{ opacity: [1, 0] }} 
                          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                          className="w-1.5 h-3 bg-ice inline-block ml-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Fallback: Inspector (Shows below the list on small screens) */}
          <div className="lg:hidden w-full mt-8">
             <AnimatePresence>
                {activeTech && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass rounded-xl p-6 overflow-hidden border border-ice/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-ice">{renderIcon(activeTech.icon)}</div>
                      <h3 className="text-xl font-shout font-bold text-paper uppercase">{activeTech.name}</h3>
                    </div>
                    <p className="text-sm text-muted">{activeTech.description}</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}