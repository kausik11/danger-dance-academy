"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Playwrite_AT } from "next/font/google";
import { academyData } from "@/lib/academy";
import {
  sectionBodyVariants,
  sectionContentVariants,
  sectionHeadingVariants,
  sectionMediaVariants,
  sectionViewport,
} from "@/lib/animationVariants";

const chairmanNameFont = Playwrite_AT({
  weight: "300",
});

export function ChairmanMessageSection() {
  const message = academyData.chairmanMessage;

  return (
    <section
      id="chairman-message"
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
    >
      <div className="pointer-events-none absolute left-[6%] top-14 h-40 w-40 rounded-full bg-sky-400/14 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-28 h-52 w-52 rounded-full bg-blue-500/12 blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="glass-panel relative overflow-hidden rounded-[38px] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/all-gif/fire.gif"
            alt=""
            fill
            unoptimized
            aria-hidden="true"
            sizes="100vw"
            className="object-cover object-center opacity-28 mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,242,254,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_30%),linear-gradient(135deg,rgba(4,14,28,0.18)_0%,rgba(5,20,40,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,24,0.68)_0%,rgba(4,14,28,0.54)_26%,rgba(3,10,24,0.72)_100%)]" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div variants={sectionContentVariants} className="max-w-3xl">
            <motion.p
              variants={sectionHeadingVariants}
              className="text-sm uppercase tracking-[0.32em] text-sky-200/70"
            >
              {message.eyebrow}
            </motion.p>
            <motion.h2
              variants={sectionHeadingVariants}
              className="mt-4 font-display text-4xl text-white sm:text-5xl"
            >
              {message.title}
            </motion.h2>
            <motion.p
              variants={sectionBodyVariants}
              className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-sky-50/92"
            >
              &ldquo;{message.quote}&rdquo;
            </motion.p>

            <motion.div variants={sectionContentVariants} className="mt-8 space-y-5">
              {message.paragraphs.map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={sectionBodyVariants}
                  className="text-base leading-8 text-slate-300/84"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={sectionMediaVariants}
            className="relative mx-auto w-full max-w-[30rem]"
          >
            <div className="pointer-events-none absolute -left-3 top-6 h-14 w-14 rounded-full border border-sky-200/35 bg-sky-100/8 backdrop-blur" />
            <div className="pointer-events-none absolute -right-3 bottom-14 h-12 w-12 rounded-full border border-cyan-200/35 bg-cyan-100/8 backdrop-blur" />

            <div className="glass-card relative overflow-hidden rounded-[34px] p-4 shadow-[0_32px_90px_rgba(2,8,23,0.28)]">
              <div className="absolute inset-x-8 top-5 h-16 rounded-full bg-sky-300/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,_rgba(224,242,254,0.22),rgba(9,21,39,0.9)_68%),linear-gradient(180deg,rgba(12,23,40,0.32)_0%,rgba(3,10,24,0.92)_100%)] p-6">
                <div className="mx-auto flex aspect-square max-w-[22rem] items-center justify-center overflow-hidden rounded-full border border-white/12 bg-[radial-gradient(circle,_rgba(224,242,254,0.22)_0%,rgba(148,163,184,0.08)_52%,rgba(15,23,42,0)_72%)]">
                  <Image
                    src={message.imageSrc}
                    alt={message.name}
                    width={760}
                    height={760}
                    className="h-full w-full object-cover"
                    priority={false}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p
                className={`${chairmanNameFont.className} text-3xl text-sky-100 sm:text-[2.15rem]`}
              >
                {message.name}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300/84">
                {message.designation}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
