import { CTASection } from "@/components/CTASection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { ServicesSection } from "@/components/ServicesSection";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await fetchAcademyModule("services");

  return (
    <PublicPageShell
      eyebrow="Services"
      title="Explore the academy programs and class tracks."
      description="Services are served from your backend API and now live on their own page, which makes the public site behave like a real multi-page frontend."
    >
      <ServicesSection services={services} />
      <CTASection />
    </PublicPageShell>
  );
}
