import { CTASection } from "@/components/CTASection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await fetchAcademyModule("success-stories");

  return (
    <PublicPageShell
      eyebrow="Success Stories"
      title="Show student growth, performance milestones, and standout journeys."
      description="Success stories now live on their own route and are fed directly from the admin-managed backend content."
    >
      <SuccessStoriesSection stories={stories} />
      <CTASection />
    </PublicPageShell>
  );
}
