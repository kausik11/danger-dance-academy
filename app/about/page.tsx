import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VideoTestimonials } from "@/components/VideoTestimonials";

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About"
      title="Get to know the academy, the mentor, and the student experience."
      description="This route breaks out the academy story, highlights, testimonials, and reviews into a dedicated page instead of leaving everything inside one long homepage."
    >
      <AboutSection />
      <VideoTestimonials />
      <ReviewsSection />
      <CTASection />
    </PublicPageShell>
  );
}
