import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { fetchAcademyModule } from "@/lib/academy-public-api";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await fetchAcademyModule("blog");

  return (
    <PublicPageShell
      eyebrow="Blog"
      title="Publish academy stories, training tips, and updates as real pages."
      description="The blog route consumes backend content and turns the frontend into a more complete multi-page website instead of a single promotional scroll."
    >
      <BlogSection posts={posts} />
      <CTASection />
    </PublicPageShell>
  );
}
