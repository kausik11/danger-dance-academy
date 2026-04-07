"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";
import {
  listContainerVariants,
  listItemVariants,
  sectionBodyVariants,
  sectionContentVariants,
  sectionHeadingVariants,
  sectionMediaVariants,
  sectionViewport,
} from "@/lib/animationVariants";

export function AboutSection() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]"
      >
        <motion.div
          variants={sectionContentVariants}
        >
          <motion.p
            variants={sectionHeadingVariants}
            className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70"
          >
            About Academy
          </motion.p>
          <motion.h2
            variants={sectionHeadingVariants}
            className="mt-4 font-display text-4xl text-white sm:text-5xl"
          >
            {academyData.academyName}
          </motion.h2>
          <motion.p
            variants={sectionBodyVariants}
            className="mt-4 text-xl text-slate-200"
          >
            {academyData.tagline}
          </motion.p>
          <motion.p
            variants={sectionBodyVariants}
            className="mt-6 max-w-2xl text-base leading-8 text-slate-300/[0.85]"
          >
            {academyData.about}
          </motion.p>

          <motion.div variants={listContainerVariants} className="mt-8 grid gap-4">
            {academyData.highlights.map((item) => (
              <motion.article
                key={item.title}
                variants={listItemVariants}
                className="glass-panel relative overflow-hidden rounded-[26px] p-5 will-change-transform"
              >
                <div className="pointer-events-none absolute inset-0">
                  <Image
                    src="/all-gif/fire.gif"
                    alt=""
                    aria-hidden="true"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center opacity-52 mix-blend-screen"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,20,0.56)_0%,rgba(4,10,20,0.46)_38%,rgba(4,10,20,0.76)_100%)]" />
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300/80">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={sectionMediaVariants}
          className="relative will-change-transform"
        >
          <div className="absolute -inset-6 bg-[radial-gradient(circle,_rgba(168,85,247,0.22),_transparent_62%)] blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-[34px] p-4">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]">
              <video
                src="/about.mp4"
                className="h-[30rem] w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/dance-poster.svg"
              />
            </div>

            <motion.div
              variants={listContainerVariants}
              className="mt-4 grid gap-4 sm:grid-cols-3"
            >
              {academyData.stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={listItemVariants}
                  className="glass-card relative overflow-hidden rounded-[24px] p-4"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <Image
                      src="/all-gif/fire.gif"
                      alt=""
                      aria-hidden="true"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-center opacity-46 mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.62)_0%,rgba(5,11,22,0.52)_42%,rgba(5,11,22,0.8)_100%)]" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
