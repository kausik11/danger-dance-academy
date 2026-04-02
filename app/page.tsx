"use client";

import dynamic from "next/dynamic";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { academyData } from "@/lib/academy";

const ThreeScene = dynamic(
  () => import("@/components/ThreeScene").then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="glass-panel h-[32rem] animate-pulse rounded-[36px]" />
      </section>
    ),
  },
);

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-[-14rem] top-[38rem] h-[32rem] w-[32rem] rounded-full bg-sky-500/16 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-[78rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/14 blur-3xl" />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <AboutSection />
        <VideoTestimonials />
        <ReviewsSection />
        <ThreeScene />
        <CTASection />
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <p>
          {academyData.shortName} | {academyData.tagline}
        </p>
        <a href={`tel:${academyData.phone}`} className="hover:text-white">
          {academyData.phone}
        </a>
      </footer>
    </div>
  );
}
