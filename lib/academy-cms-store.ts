import { randomUUID } from "node:crypto";
import type {
  Collection,
  Filter,
  OptionalUnlessRequiredId,
} from "mongodb";
import {
  academyModuleRegistry,
  createSeedContent,
  type AcademyCollectionSlug,
  type AcademyContentData,
  type AcademyModuleRecord,
  type AcademyModuleRecordBySlug,
  type BlogItem,
  type EventItem,
  type FaqItem,
  type GalleryItem,
  type ServiceItem,
  type SuccessStoryItem,
} from "@/lib/academy-cms";
import { getMongoDb } from "@/lib/mongodb";

declare global {
  var academySeedPromise: Promise<void> | undefined;
}

const sortByUpdatedAt = {
  updatedAt: -1 as const,
  createdAt: -1 as const,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asString(
  payload: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const value = payload[key];

  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function asBoolean(
  payload: Record<string, unknown>,
  key: string,
  fallback = false,
): boolean {
  const value = payload[key];

  if (typeof value !== "boolean") {
    return fallback;
  }

  return value;
}

function asNumber(
  payload: Record<string, unknown>,
  key: string,
  fallback = 0,
): number {
  const value = payload[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function getModuleCollection<T extends AcademyCollectionSlug>(
  moduleSlug: T,
): Promise<Collection<AcademyModuleRecordBySlug[T]>> {
  const db = await getMongoDb();
  const collectionName = academyModuleRegistry[moduleSlug].dataKey;

  return db.collection<AcademyModuleRecordBySlug[T]>(collectionName);
}

async function seedCollectionIfEmpty<K extends keyof AcademyContentData>(
  key: K,
  records: AcademyContentData[K],
) {
  const db = await getMongoDb();
  const collection = db.collection<AcademyContentData[K][number]>(key);
  const count = await collection.countDocuments({}, { limit: 1 });

  if (count === 0 && records.length > 0) {
    await collection.insertMany(
      records as OptionalUnlessRequiredId<AcademyContentData[K][number]>[],
    );
  }
}

async function ensureAcademyCollectionsSeeded() {
  if (!global.academySeedPromise) {
    global.academySeedPromise = (async () => {
      const seedContent = createSeedContent();

      await Promise.all([
        seedCollectionIfEmpty("services", seedContent.services),
        seedCollectionIfEmpty("events", seedContent.events),
        seedCollectionIfEmpty("gallery", seedContent.gallery),
        seedCollectionIfEmpty("faqs", seedContent.faqs),
        seedCollectionIfEmpty("blog", seedContent.blog),
        seedCollectionIfEmpty("successStories", seedContent.successStories),
      ]);
    })();
  }

  await global.academySeedPromise;
}

function buildServiceRecord(
  input: Record<string, unknown>,
  existing?: ServiceItem,
): ServiceItem {
  const title = asString(input, "title", existing?.title ?? "New Service");

  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? true),
    title,
    slug: asString(input, "slug", existing?.slug ?? slugify(title)),
    summary: asString(input, "summary", existing?.summary ?? ""),
    description: asString(input, "description", existing?.description ?? ""),
    ageGroup: asString(input, "ageGroup", existing?.ageGroup ?? "All ages"),
    priceLabel: asString(input, "priceLabel", existing?.priceLabel ?? ""),
    imageUrl: asString(input, "imageUrl", existing?.imageUrl ?? "/logo.jpeg"),
    featured: asBoolean(input, "featured", existing?.featured ?? false),
  };
}

function buildEventRecord(
  input: Record<string, unknown>,
  existing?: EventItem,
): EventItem {
  const title = asString(input, "title", existing?.title ?? "New Event");
  const statusValue = asString(input, "status", existing?.status ?? "upcoming");
  const status: EventItem["status"] =
    statusValue === "completed" || statusValue === "cancelled"
      ? statusValue
      : "upcoming";

  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? true),
    title,
    slug: asString(input, "slug", existing?.slug ?? slugify(title)),
    summary: asString(input, "summary", existing?.summary ?? ""),
    description: asString(input, "description", existing?.description ?? ""),
    date: asString(input, "date", existing?.date ?? new Date().toISOString()),
    location: asString(input, "location", existing?.location ?? ""),
    registrationUrl: asString(
      input,
      "registrationUrl",
      existing?.registrationUrl ?? "",
    ),
    bannerUrl: asString(input, "bannerUrl", existing?.bannerUrl ?? "/logo.jpeg"),
    status,
    featured: asBoolean(input, "featured", existing?.featured ?? false),
  };
}

function buildGalleryRecord(
  input: Record<string, unknown>,
  existing?: GalleryItem,
): GalleryItem {
  const mediaTypeValue = asString(
    input,
    "mediaType",
    existing?.mediaType ?? "image",
  );
  const mediaType: GalleryItem["mediaType"] =
    mediaTypeValue === "video" ? "video" : "image";

  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? true),
    title: asString(input, "title", existing?.title ?? "Gallery Item"),
    category: asString(input, "category", existing?.category ?? "General"),
    mediaType,
    assetUrl: asString(input, "assetUrl", existing?.assetUrl ?? "/logo.jpeg"),
    thumbnailUrl: asString(
      input,
      "thumbnailUrl",
      existing?.thumbnailUrl ?? "/logo.jpeg",
    ),
    caption: asString(input, "caption", existing?.caption ?? ""),
    featured: asBoolean(input, "featured", existing?.featured ?? false),
  };
}

function buildFaqRecord(
  input: Record<string, unknown>,
  existing?: FaqItem,
): FaqItem {
  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? true),
    question: asString(input, "question", existing?.question ?? "New FAQ"),
    answer: asString(input, "answer", existing?.answer ?? ""),
    category: asString(input, "category", existing?.category ?? "General"),
  };
}

function buildBlogRecord(
  input: Record<string, unknown>,
  existing?: BlogItem,
): BlogItem {
  const title = asString(input, "title", existing?.title ?? "New Blog Post");

  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? false),
    title,
    slug: asString(input, "slug", existing?.slug ?? slugify(title)),
    excerpt: asString(input, "excerpt", existing?.excerpt ?? ""),
    content: asString(input, "content", existing?.content ?? ""),
    coverImageUrl: asString(
      input,
      "coverImageUrl",
      existing?.coverImageUrl ?? "/logo.jpeg",
    ),
    author: asString(input, "author", existing?.author ?? "Academy Team"),
    readingTime: asString(input, "readingTime", existing?.readingTime ?? ""),
    publishedAt: asString(
      input,
      "publishedAt",
      existing?.publishedAt ?? new Date().toISOString(),
    ),
  };
}

function buildSuccessStoryRecord(
  input: Record<string, unknown>,
  existing?: SuccessStoryItem,
): SuccessStoryItem {
  const studentName = asString(
    input,
    "studentName",
    existing?.studentName ?? "Student Name",
  );

  return {
    id: existing?.id ?? randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: asBoolean(input, "published", existing?.published ?? true),
    studentName,
    slug: asString(input, "slug", existing?.slug ?? slugify(studentName)),
    headline: asString(input, "headline", existing?.headline ?? ""),
    story: asString(input, "story", existing?.story ?? ""),
    achievement: asString(input, "achievement", existing?.achievement ?? ""),
    yearJoined: asNumber(
      input,
      "yearJoined",
      existing?.yearJoined ?? new Date().getFullYear(),
    ),
    photoUrl: asString(input, "photoUrl", existing?.photoUrl ?? "/logo.jpeg"),
    featured: asBoolean(input, "featured", existing?.featured ?? false),
  };
}

function buildRecord<T extends AcademyCollectionSlug>(
  moduleSlug: T,
  input: Record<string, unknown>,
  existing?: AcademyModuleRecord,
): AcademyModuleRecordBySlug[T] {
  switch (moduleSlug) {
    case "services":
      return buildServiceRecord(
        input,
        existing as ServiceItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
    case "events":
      return buildEventRecord(
        input,
        existing as EventItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
    case "gallery":
      return buildGalleryRecord(
        input,
        existing as GalleryItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
    case "faqs":
      return buildFaqRecord(
        input,
        existing as FaqItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
    case "blog":
      return buildBlogRecord(
        input,
        existing as BlogItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
    case "success-stories":
      return buildSuccessStoryRecord(
        input,
        existing as SuccessStoryItem | undefined,
      ) as AcademyModuleRecordBySlug[T];
  }
}

async function listCollection<T extends AcademyCollectionSlug>(
  moduleSlug: T,
): Promise<AcademyModuleRecordBySlug[T][]> {
  const collection = await getModuleCollection(moduleSlug);
  const items = await collection
    .find({}, { projection: { _id: 0 } })
    .sort(sortByUpdatedAt)
    .toArray();

  return items as AcademyModuleRecordBySlug[T][];
}

export async function getAcademyContent(): Promise<AcademyContentData> {
  await ensureAcademyCollectionsSeeded();

  const [services, events, gallery, faqs, blog, successStories] =
    await Promise.all([
      listCollection("services"),
      listCollection("events"),
      listCollection("gallery"),
      listCollection("faqs"),
      listCollection("blog"),
      listCollection("success-stories"),
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

export async function listAcademyModule<T extends AcademyCollectionSlug>(
  moduleSlug: T,
): Promise<AcademyModuleRecordBySlug[T][]> {
  await ensureAcademyCollectionsSeeded();
  return listCollection(moduleSlug);
}

export async function getAcademyModuleItem<T extends AcademyCollectionSlug>(
  moduleSlug: T,
  id: string,
): Promise<AcademyModuleRecordBySlug[T] | null> {
  await ensureAcademyCollectionsSeeded();

  const collection = await getModuleCollection(moduleSlug);
  const filter = { id } as Filter<AcademyModuleRecordBySlug[T]>;

  const item = await collection.findOne(
    filter,
    {
      projection: { _id: 0 },
    },
  );

  return item as AcademyModuleRecordBySlug[T] | null;
}

export async function createAcademyModuleItem<T extends AcademyCollectionSlug>(
  moduleSlug: T,
  input: unknown,
): Promise<AcademyModuleRecordBySlug[T]> {
  if (!isRecord(input)) {
    throw new Error("Request body must be a JSON object.");
  }

  await ensureAcademyCollectionsSeeded();

  const collection = await getModuleCollection(moduleSlug);
  const nextRecord = buildRecord(moduleSlug, input);

  await collection.insertOne(
    nextRecord as OptionalUnlessRequiredId<AcademyModuleRecordBySlug[T]>,
  );

  return nextRecord;
}

export async function updateAcademyModuleItem<T extends AcademyCollectionSlug>(
  moduleSlug: T,
  id: string,
  input: unknown,
): Promise<AcademyModuleRecordBySlug[T] | null> {
  if (!isRecord(input)) {
    throw new Error("Request body must be a JSON object.");
  }

  await ensureAcademyCollectionsSeeded();

  const collection = await getModuleCollection(moduleSlug);
  const filter = { id } as Filter<AcademyModuleRecordBySlug[T]>;
  const existing = (await collection.findOne(
    filter,
    { projection: { _id: 0 } },
  )) as AcademyModuleRecordBySlug[T] | null;

  if (!existing) {
    return null;
  }

  const updatedRecord = buildRecord(moduleSlug, input, existing);

  await collection.replaceOne(filter, updatedRecord);

  return updatedRecord;
}

export async function deleteAcademyModuleItem<T extends AcademyCollectionSlug>(
  moduleSlug: T,
  id: string,
) {
  await ensureAcademyCollectionsSeeded();

  const collection = await getModuleCollection(moduleSlug);
  const filter = { id } as Filter<AcademyModuleRecordBySlug[T]>;
  const result = await collection.deleteOne(filter);

  return result.deletedCount > 0;
}
