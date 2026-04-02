"use client";

import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";

export function CTASection() {
  return (
    <section id="join" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[36px] border border-white/12 bg-[linear-gradient(135deg,rgba(8,47,73,0.95)_0%,rgba(29,78,216,0.9)_48%,rgba(14,165,233,0.86)_100%)] px-6 py-12 shadow-[0_0_55px_rgba(59,130,246,0.28)] sm:px-10 sm:py-14"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_34%)]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Join Now
            </p>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
              Join the Best Dance Academy Today
            </h2>
            <p className="mt-4 text-base leading-8 text-white/[0.82]">
              Secure your spot at Danger Dance Academy and start training with a focused, high-energy team.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={`tel:${academyData.phone}`}
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(255,255,255,0.28)] hover:scale-[1.02]"
            >
              Call Now
            </a>
            <div className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-black/20 px-8 text-sm font-semibold text-white backdrop-blur">
              {academyData.phone}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
