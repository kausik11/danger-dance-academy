import { AboutSection } from "@/components/AboutSection";
import { ChairmanMessageSection } from "@/components/ChairmanMessageSection";
import { CTASection } from "@/components/CTASection";
import { EventsSection } from "@/components/EventsSection";
import { FaqSection } from "@/components/FaqSection";
import { GallerySection } from "@/components/GallerySection";
import { HomeClientShell } from "@/components/HomeClientShell";
import { Hero } from "@/components/Hero";
import { HomeThreeScene } from "@/components/HomeThreeScene";
import { Navbar } from "@/components/Navbar";
import { ReviewsSection } from "@/components/ReviewsSection";
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
          <AboutSection />
          <ChairmanMessageSection />
          <ServicesSection services={academyModules.services} />
          <EventsSection events={academyModules.events} />
          <GallerySection gallery={academyModules.gallery} />
          {/* <BlogSection posts={academyModules.blog} /> */}
          <SuccessStoriesSection stories={academyModules.successStories} />
          <VideoTestimonials />
          <ReviewsSection />
          <HomeThreeScene />
          <CTASection />
          <FaqSection faqs={academyModules.faqs} />
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
    </HomeClientShell>
  );
}
