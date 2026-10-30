"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { journey } from "@/lib/data";

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll to draw the line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="journey" className="relative py-32 bg-ink overflow-hidden border-t border-glass-border">
      <div className="container-signal relative z-10">
        
        {/* Section Header */}
        <div className="mb-20">
          <p className="meta text-ice mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-ice/50" />
            CHAPTER 04 — TRAJECTORY
          </p>
          <h2 className="text-section max-w-4xl">
            Where I'm <span className="font-voice text-ice lowercase tracking-normal text-[1.1em]">going</span>.
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-3xl" ref={containerRef}>
          
          {/* Background Line (Static) */}
          <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-glass-border/50" />
          
          {/* Foreground Line (Animated Drawing) */}
          <motion.div 
            style={{ scaleY: lineHeight }}
            className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-ice origin-top shadow-[0_0_10px_rgba(34,211,238,0.5)] z-0" 
          />

          <div className="flex flex-col gap-14">
            {journey.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Node Dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                  className="absolute left-0 top-1.5 flex items-center justify-center z-10"
                >
                  <div 
                    className={`w-6 h-6 rounded-full border-[3px] bg-ink flex items-center justify-center transition-colors duration-500 ${
                      item.current 
                        ? "border-lime shadow-[0_0_15px_rgba(163,230,53,0.5)]" 
                        : "border-muted"
                    }`} 
                  >
                    {/* Pinging effect for the Current node */}
                    {item.current && (
                      <span className="absolute inset-0 rounded-full bg-lime animate-ping opacity-30" />
                    )}
                  </div>
                </motion.div>
                
                {/* Content */}
                <div className="flex flex-col gap-2">
                  <span className={`meta ${item.current ? 'text-lime' : 'text-ice'}`}>
                    {item.year} {item.current && "— CURRENT"}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-shout font-bold text-paper">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted mt-1 leading-relaxed max-w-xl text-sm md:text-base">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}