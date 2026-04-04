import "server-only";
import { headers } from "next/headers";
import type {
  AcademyCollectionSlug,
  AcademyModuleRecordBySlug,
} from "@/lib/academy-cms";

type AcademyModuleResponse<T extends AcademyCollectionSlug> = {
  items: AcademyModuleRecordBySlug[T][];
};

async function getBaseUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function fetchAcademyModule<T extends AcademyCollectionSlug>(
  moduleSlug: T,
): Promise<AcademyModuleRecordBySlug[T][]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/academy/${moduleSlug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load academy module "${moduleSlug}".`);
  }

  const data = (await response.json()) as AcademyModuleResponse<T>;

  return data.items;
}

export async function fetchHomepageAcademyModules() {
  const [
    services,
    events,
    gallery,
    faqs,
    blog,
    successStories,
  ] = await Promise.all([
    fetchAcademyModule("services"),
    fetchAcademyModule("events"),
    fetchAcademyModule("gallery"),
    fetchAcademyModule("faqs"),
    fetchAcademyModule("blog"),
    fetchAcademyModule("success-stories"),
  ]);

  return {
    services,
    events,
    gallery,
    faqs,
    blog,
    successStories,
  };
}
