"use client";

import { useScroll, useSpring, motion } from "motion/react";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setPercent(Math.round(v * 100)));
  }, [scrollYProgress]);

  return (
    <>
      {/* The 2px thin line at the very top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-violet origin-left z-50" 
        style={{ scaleX }} 
      />
      
      {/* The SIGNAL % readout top-right */}
      <div className="fixed top-6 right-6 z-40 hidden md:block meta text-paper/60 mix-blend-difference font-data">
        SIGNAL {percent.toString().padStart(3, "0")}%
      </div>
    </>
  );
}