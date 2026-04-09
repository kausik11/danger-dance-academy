"use client";

import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";
import {
  listContainerVariants,
  listItemVariants,
  sectionHeadingVariants,
  sectionViewport,
} from "@/lib/animationVariants";
import { EyeFollowWord } from "@/components/EyeFollowWord";
import { VideoFrame } from "@/components/VideoFrame";

export function VideoTestimonials() {
  return (
    <motion.section
      id="testimonials"
      className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={listContainerVariants}
    >
      <motion.div
        variants={sectionHeadingVariants}
        className="max-w-5xl"
      >
        <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Video Testimonials
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <h2 className="max-w-3xl font-display text-3xl text-white sm:text-5xl">
            Watch the energy, confidence, and joy in motion.
          </h2>
          <EyeFollowWord
            className="origin-left scale-75 self-start px-0 sm:scale-100 lg:shrink-0"
            ariaLabel="Eyes following your movement"
          />
        </div>
      </motion.div>

      <motion.div
        variants={listContainerVariants}
        className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {academyData.videoTestimonials.map((item) => (
          <motion.article
            key={item.name}
            variants={listItemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-panel overflow-hidden rounded-[28px] p-3 will-change-transform sm:rounded-[30px] sm:p-4"
          >
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
              <VideoFrame
                src={item.videoSrc}
                title={`${item.name} testimonial video`}
                className="aspect-[4/5] w-full border-0 object-cover"
                autoPlay
                muted
                loop
                controls
                preload="auto"
                poster="/dance-poster.svg"
              />
            </div>
            <div className="px-1 pb-2 pt-5">
              <h3 className="font-display text-xl text-white sm:text-2xl">{item.name}</h3>
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
