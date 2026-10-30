"use client";

import { useScroll, useVelocity, useSpring, useTransform, motion } from "motion/react";
import { ReactNode } from "react";

export function SkewWrapper({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth out the velocity so it doesn't jerk around
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Map the velocity to a skewX value (max 5 degrees)
  const skew = useTransform(smoothVelocity, [-2000, 2000], [-5, 5], { clamp: false });

  return (
    <motion.div style={{ skewX: skew }} className="origin-top w-full">
      {children}
    </motion.div>
  );
}