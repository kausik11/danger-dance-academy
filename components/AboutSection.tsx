"use client";

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
            className="text-sm uppercase tracking-[0.3em] text-sky-200/70"
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
                className="glass-panel rounded-[26px] p-5 will-change-transform"
              >
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300/80">
                  {item.description}
                </p>
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
                  className="glass-card rounded-[24px] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
