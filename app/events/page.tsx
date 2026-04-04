import { CTASection } from "@/components/CTASection";
import { EventsSection } from "@/components/EventsSection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await fetchAcademyModule("events");

  return (
    <PublicPageShell
      eyebrow="Events"
      title="Track showcases, workshops, and upcoming academy moments."
      description="The events page is connected directly to your academy backend so workshops and showcases can be published from the admin panel."
    >
      <EventsSection events={events} />
      <CTASection />
    </PublicPageShell>
  );
}
