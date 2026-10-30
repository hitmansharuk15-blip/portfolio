"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { projects, Project } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { playTick } from "@/lib/audio";

export function ProjectShowcase() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [isTouch, setIsTouch] = useState(false);
  
  // --- AUDIO STATE ---
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const checkMute = () => setIsMuted(localStorage.getItem("site-muted") !== "false");
    checkMute();
    window.addEventListener("sound-toggled", checkMute);
    return () => window.removeEventListener("sound-toggled", checkMute);
  }, []);

  // Safely check if the user is on a touch device
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Track mouse for the floating preview image
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section 
      id="projects" 
      className="relative py-32 bg-deep overflow-hidden border-t border-glass-border"
      onMouseMove={handleMouseMove}
    >
      {/* Floating Preview Image (Desktop Only) */}
      <AnimatePresence>
        {hoveredProject && !isTouch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: mousePos.x + 20, y: mousePos.y - 150 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
            className="fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl border border-glass-border"
          >
            <Image 
              src={hoveredProject.cover} 
              alt={hoveredProject.title} 
              fill 
              sizes="300px"
              className="object-cover"
            />
            {hoveredProject.placeholder && (
              <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                <span className="meta text-paper">PLACEHOLDER</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-signal relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="meta text-ice mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-ice/50" />
              CHAPTER 03 — ARTIFACTS
            </p>
            <h2 className="text-section max-w-2xl">
              Digital <span className="font-voice text-ice lowercase tracking-normal text-[1.1em]">experiments</span>.
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            {["all", "web", "ai", "experiments"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  playTick(isMuted); // <-- SOUND ON CLICK
                }}
                className={`meta pb-1 border-b transition-colors uppercase ${
                  activeFilter === filter ? "text-paper border-paper" : "text-muted border-transparent hover:text-paper"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Project List */}
        <div className="flex flex-col border-t border-glass-border">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              // 👇 CHANGED FROM <Link> TO <a> TO OPEN GITHUB 👇
              <a 
                key={project.id} 
                href={project.github || project.demo || "https://github.com/hitmansharuk15-blip/foodie-express"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => {
                    setHoveredProject(project);
                    playTick(isMuted); // <-- SOUND ON HOVER
                  }}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="relative flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-glass-border group-hover:bg-glass/5 transition-colors px-4 -mx-4 rounded-xl"
                >
                  {/* Mobile Preview Image */}
                  <div className="md:hidden w-full aspect-video rounded-xl overflow-hidden mb-6 relative">
                    <Image 
                      src={project.cover} 
                      alt={project.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover" 
                    />
                    {project.placeholder && (
                      <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                        <span className="meta text-paper">PLACEHOLDER</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start md:items-center gap-6 md:gap-12 flex-1">
                    <span className="meta text-muted group-hover:text-ice transition-colors mt-1 md:mt-0">
                      {project.index}
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-3xl md:text-5xl font-shout font-bold uppercase tracking-tight text-paper group-hover:translate-x-2 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted max-w-md text-sm">{project.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0 w-full md:w-auto">
                    {/* Stack (Desktop Only) */}
                    <div className="hidden lg:flex items-center gap-3">
                      {project.stack.slice(0, 3).map(tech => (
                        <span key={tech} className="meta text-muted px-3 py-1 rounded-full border border-glass-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="meta text-muted hidden md:block">{project.year}</span>
                      
                      {/* Arrow Icon */}
                      <div className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center group-hover:bg-paper group-hover:text-ink transition-colors">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </a>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}