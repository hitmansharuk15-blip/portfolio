"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollReveal({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"] // Starts when text enters bottom of screen, ends near top
  });

  const words = text.split(" ");

  return (
    <p ref={container} className="text-xl md:text-2xl leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

const Word = ({ children, progress, range }: { children: string, progress: any, range: [number, number] }) => {
  // Fade from 20% opacity to 100% opacity
  const opacity = useTransform(progress, range, [0.2, 1]);
  
  return (
    <span className="relative mr-1">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};