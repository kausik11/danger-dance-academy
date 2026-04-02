"use client";

import { motion, type Variants } from "framer-motion";
import { academyData } from "@/lib/academy";

const titleWords = academyData.hero.title.split(" ");

const titleContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const titleWord: Variants = {
  hidden: {
    opacity: 0,
    y: -260,
    scaleY: 1.24,
    scaleX: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    scaleX: 1,
    transition: {
      type: "spring",
      stiffness: 210,
      damping: 14,
      mass: 0.9,
    },
  },
};

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={academyData.hero.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/dance-poster.svg"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.34),_transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.14)_0%,rgba(7,20,47,0.72)_70%,rgba(3,10,28,0.94)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center justify-center px-6 pb-20 pt-32 text-center sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-100/90 backdrop-blur">
            Baranagar | Dunlop | Belghoria
          </div>

          <motion.h1
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="mt-7 font-display text-5xl leading-[0.96] text-white sm:text-7xl lg:text-[5.6rem]"
          >
            {titleWords.map((word) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-4">
                <motion.span
                  variants={titleWord}
                  className="inline-block bg-[linear-gradient(180deg,#ffffff_0%,#d7efff_48%,#9fd3ff_100%)] bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(96,165,250,0.26)]"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <p className="mt-4 text-balance text-lg text-slate-200 sm:text-2xl">
            {academyData.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#join"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
