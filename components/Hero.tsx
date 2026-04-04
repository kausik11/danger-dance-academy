"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { academyData } from "@/lib/academy";
import {
  createFadeUp,
  heroContentVariants,
  heroTitleVariants,
  heroViewport,
  heroWordVariants,
} from "@/lib/animationVariants";

const titleWords = academyData.hero.title.split(" ");
const heroTextVariants = createFadeUp(22, 0.72);
const heroButtonsVariants = createFadeUp(26, 0.78);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Keep the parallax subtle so the hero feels cinematic without causing lag.
  const rawVideoY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const rawGlowY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const videoY = useSpring(rawVideoY, {
    stiffness: 120,
    damping: 26,
    mass: 0.24,
  });
  const glowY = useSpring(rawGlowY, {
    stiffness: 110,
    damping: 24,
    mass: 0.28,
  });

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[100svh] overflow-hidden">
      <motion.div
        className="absolute -inset-8 will-change-transform"
        style={shouldReduceMotion ? undefined : { y: videoY }}
      >
        <video
          className="h-full w-full object-cover"
          src={academyData.hero.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/dance-poster.svg"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={shouldReduceMotion ? undefined : { y: glowY }}
      >
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.34),_transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.14)_0%,rgba(7,20,47,0.72)_70%,rgba(3,10,28,0.94)_100%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center justify-center px-6 pb-20 pt-32 text-center sm:px-8 lg:px-10">
        <motion.div
          variants={heroContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={heroViewport}
          className="max-w-4xl"
        >
          <motion.div
            variants={heroTextVariants}
            className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-100/90 backdrop-blur"
          >
            Baranagar | Dunlop | Belghoria
          </motion.div>

          <motion.h1
            variants={heroTitleVariants}
            className="mt-7 font-display text-5xl leading-[0.96] text-white sm:text-7xl lg:text-[5.6rem]"
          >
            {titleWords.map((word) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-4">
                <motion.span
                  variants={heroWordVariants}
                  className="inline-block bg-[linear-gradient(180deg,#ffffff_0%,#d7efff_48%,#9fd3ff_100%)] bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(96,165,250,0.26)]"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p
            variants={heroTextVariants}
            className="mt-4 text-balance text-lg text-slate-200 sm:text-2xl"
          >
            {academyData.hero.subtitle}
          </motion.p>

          <motion.div
            variants={heroButtonsVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="/join"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-8 text-sm font-semibold text-slate-950 shadow-[0_0_48px_rgba(96,165,250,0.36)] hover:scale-[1.02]"
            >
              {academyData.hero.ctaLabel}
            </a>
            <a
              href={`tel:${academyData.phone}`}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-8 text-sm font-semibold text-white backdrop-blur hover:bg-white/[0.12]"
            >
              Call {academyData.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
