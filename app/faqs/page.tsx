import { CTASection } from "@/components/CTASection";
import { FaqSection } from "@/components/FaqSection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await fetchAcademyModule("faqs");

  return (
    <PublicPageShell
      eyebrow="FAQs"
      title="Answer parent and student questions on a dedicated page."
      description="This page is powered by the academy FAQ module, so admin changes can go live without touching frontend code."
    >
      <FaqSection faqs={faqs} />
      <CTASection />
    </PublicPageShell>
  );
}
