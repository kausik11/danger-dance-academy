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
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollVideoSlider } from "@/components/ScrollVideoSlider";
import { ServicesSection } from "@/components/ServicesSection";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { VideoTestimonials } from "@/components/VideoTestimonials";
import { fetchHomepageAcademyModules } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const academyModules = await fetchHomepageAcademyModules();

  return (
    <HomeClientShell>
      <div className="relative overflow-x-clip">
        <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute left-[-10rem] top-[32rem] h-[24rem] w-[24rem] rounded-full bg-sky-500/16 blur-3xl sm:left-[-14rem] sm:top-[38rem] sm:h-[32rem] sm:w-[32rem]" />
        <div className="pointer-events-none absolute right-[-8rem] top-[72rem] h-[20rem] w-[20rem] rounded-full bg-blue-500/14 blur-3xl sm:right-[-10rem] sm:top-[78rem] sm:h-[28rem] sm:w-[28rem]" />

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

        <SiteFooter />
      </div>
    </HomeClientShell>
  );
}
