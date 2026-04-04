import { CTASection } from "@/components/CTASection";
import { GallerySection } from "@/components/GallerySection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await fetchAcademyModule("gallery");

  return (
    <PublicPageShell
      eyebrow="Gallery"
      title="See the academy through performances, rehearsals, and studio moments."
      description="Gallery media is loaded from the backend and shown on its own route so visual content can scale independently from the landing page."
    >
      <GallerySection gallery={gallery} />
      <CTASection />
    </PublicPageShell>
  );
}
