"use client";

import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";

export function VideoTestimonials() {
  return (
    <section
      id="testimonials"
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Video Testimonials
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Watch the energy, confidence, and joy in motion.
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {academyData.videoTestimonials.map((item, index) => (
          <motion.article
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel overflow-hidden rounded-[30px] p-4"
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
      </div>
    </section>
  );
}
