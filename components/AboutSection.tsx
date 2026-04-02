"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";

export function AboutSection() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
            About Academy
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            {academyData.academyName}
          </h2>
          <p className="mt-4 text-xl text-slate-200">{academyData.tagline}</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300/[0.85]">
            {academyData.about}
          </p>

          <div className="mt-8 grid gap-4">
            {academyData.highlights.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="glass-panel rounded-[26px] p-5"
              >
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300/80">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-[radial-gradient(circle,_rgba(168,85,247,0.22),_transparent_62%)] blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-[34px] p-4">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#070612]">
              <Image
                src="/dance-poster.svg"
                alt="Danger Dance Academy visual poster"
                width={900}
                height={1080}
                className="h-[30rem] w-full object-cover"
                priority
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {academyData.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-white/10 bg-black/25 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
