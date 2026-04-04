"use client";

import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";
import {
  listContainerVariants,
  listItemVariants,
  sectionHeadingVariants,
  sectionViewport,
} from "@/lib/animationVariants";

export function VideoTestimonials() {
  return (
    <motion.section
      id="testimonials"
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={listContainerVariants}
    >
      <motion.div
        variants={sectionHeadingVariants}
        className="max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Video Testimonials
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Watch the energy, confidence, and joy in motion.
        </h2>
      </motion.div>

      <motion.div variants={listContainerVariants} className="mt-10 grid gap-6 lg:grid-cols-3">
        {academyData.videoTestimonials.map((item) => (
          <motion.article
            key={item.name}
            variants={listItemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-panel overflow-hidden rounded-[30px] p-4 will-change-transform"
          >
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
              <video
                src={item.videoSrc}
                className="aspect-[4/5] w-full object-cover"
                autoPlay
                muted
                loop
                controls
                playsInline
                preload="auto"
                poster="/dance-poster.svg"
              />
            </div>
            <div className="px-1 pb-2 pt-5">
              <h3 className="font-display text-2xl text-white">{item.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300/80">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
