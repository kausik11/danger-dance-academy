"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // Smooth the progress value so the bar feels polished without adding extra work
  // to the rest of the page.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.18,
  });
  const scaleX = shouldReduceMotion ? scrollYProgress : smoothProgress;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-white/5"
    >
      <motion.div
        className="h-full origin-left bg-[linear-gradient(90deg,#7dd3fc_0%,#38bdf8_48%,#e0f2fe_100%)] shadow-[0_0_24px_rgba(56,189,248,0.45)]"
        style={{ scaleX }}
      />
    </div>
  );
}
