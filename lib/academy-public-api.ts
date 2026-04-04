import "server-only";
import type {
  AcademyCollectionSlug,
  AcademyModuleRecordBySlug,
} from "@/lib/academy-cms";
import { getAcademyContentWithFallback } from "@/lib/academy-cms-store";

function mapModuleFromContent<T extends AcademyCollectionSlug>(
  content: Awaited<ReturnType<typeof getAcademyContentWithFallback>>,
  moduleSlug: T,
): AcademyModuleRecordBySlug[T][] {
  switch (moduleSlug) {
    case "services":
      return content.services as AcademyModuleRecordBySlug[T][];
    case "events":
      return content.events as AcademyModuleRecordBySlug[T][];
    case "gallery":
      return content.gallery as AcademyModuleRecordBySlug[T][];
    case "faqs":
      return content.faqs as AcademyModuleRecordBySlug[T][];
    case "blog":
      return content.blog as AcademyModuleRecordBySlug[T][];
    case "success-stories":
      return content.successStories as AcademyModuleRecordBySlug[T][];
  }
}

export async function fetchAcademyModule<T extends AcademyCollectionSlug>(
  moduleSlug: T,
): Promise<AcademyModuleRecordBySlug[T][]> {
  const content = await getAcademyContentWithFallback();
  return mapModuleFromContent(content, moduleSlug);
}

export async function fetchHomepageAcademyModules() {
  const content = await getAcademyContentWithFallback();

  return {
    services: content.services,
    events: content.events,
    gallery: content.gallery,
    faqs: content.faqs,
    blog: content.blog,
    successStories: content.successStories,
  };
}
