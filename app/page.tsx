import { Heart } from "lucide-react";
import { AboutSection } from "@/components/AboutSection";
import { ChairmanMessageSection } from "@/components/ChairmanMessageSection";
import { CTASection } from "@/components/CTASection";
import { DanceStylesSection } from "@/components/DanceStylesSection";
import { EventsSection } from "@/components/EventsSection";
import { GallerySection } from "@/components/GallerySection";
import { HomeClientShell } from "@/components/HomeClientShell";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ScrollVideoSlider } from "@/components/ScrollVideoSlider";
import { ServicesSection } from "@/components/ServicesSection";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { academyData } from "@/lib/academy";
import { fetchHomepageAcademyModules } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const academyModules = await fetchHomepageAcademyModules();

  return (
    <HomeClientShell>
      <div className="relative overflow-hidden">
        <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute left-[-14rem] top-[38rem] h-[32rem] w-[32rem] rounded-full bg-sky-500/16 blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-[78rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/14 blur-3xl" />

        <Navbar />

        <main className="relative z-10">
          <Hero />
          <DanceStylesSection />
          <AboutSection />
          <ScrollVideoSlider />
          <ChairmanMessageSection />
          <ServicesSection services={academyModules.services} />
          <EventsSection events={academyModules.events} />
          <GallerySection gallery={academyModules.gallery} />
          {/* <BlogSection posts={academyModules.blog} /> */}
          <SuccessStoriesSection stories={academyModules.successStories} />

          <ReviewsSection />
          <CTASection />
          {/* <FaqSection faqs={academyModules.faqs} /> */}
          <VideoTestimonials />
        </main>

        <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="space-y-1">
            <p>
              {academyData.shortName} | {academyData.tagline}
            </p>
            <p className="flex flex-wrap items-center gap-2 text-slate-400/90">
              <span>All rights reserved.</span>
              <span>Design and developed by</span>
              <a
                href="https://www.linkedin.com/in/kausik-saha-fsd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-amber-200/28 bg-[linear-gradient(135deg,rgba(255,248,220,0.2)_0%,rgba(245,158,11,0.16)_45%,rgba(251,191,36,0.22)_100%)] px-3 py-1 font-display text-[0.78rem] uppercase tracking-[0.28em] text-amber-100 shadow-[0_10px_30px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:border-amber-100/40 hover:text-white hover:shadow-[0_14px_34px_rgba(245,158,11,0.26),inset_0_1px_0_rgba(255,255,255,0.26)]"
              >
                kausik
              </a>
              <Heart className="h-4 w-4 fill-rose-500 text-rose-400" aria-hidden="true" />
            </p>
          </div>
          <a href={`tel:${academyData.phone}`} className="hover:text-white">
            {academyData.phone}
          </a>
        </footer>
      </div>
    </HomeClientShell>
  );
}
