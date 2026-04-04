export type AcademyCollectionSlug =
  | "services"
  | "events"
  | "gallery"
  | "faqs"
  | "blog"
  | "success-stories";

export type ContentItemBase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
};

export type ServiceItem = ContentItemBase & {
  title: string;
  slug: string;
  summary: string;
  description: string;
  ageGroup: string;
  priceLabel: string;
  imageUrl: string;
  featured: boolean;
};

export type EventItem = ContentItemBase & {
  title: string;
  slug: string;
  summary: string;
  description: string;
  date: string;
  location: string;
  registrationUrl: string;
  bannerUrl: string;
  status: "upcoming" | "completed" | "cancelled";
  featured: boolean;
};

export type GalleryItem = ContentItemBase & {
  title: string;
  category: string;
  mediaType: "image" | "video";
  assetUrl: string;
  thumbnailUrl: string;
  caption: string;
  featured: boolean;
};

export type FaqItem = ContentItemBase & {
  question: string;
  answer: string;
  category: string;
};

export type BlogItem = ContentItemBase & {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
  readingTime: string;
  publishedAt: string;
};

export type SuccessStoryItem = ContentItemBase & {
  studentName: string;
  slug: string;
  headline: string;
  story: string;
  achievement: string;
  yearJoined: number;
  photoUrl: string;
  featured: boolean;
};

export type AcademyContentData = {
  services: ServiceItem[];
  events: EventItem[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
  blog: BlogItem[];
  successStories: SuccessStoryItem[];
};

export type AcademyModuleRecordBySlug = {
  services: ServiceItem;
  events: EventItem;
  gallery: GalleryItem;
  faqs: FaqItem;
  blog: BlogItem;
  "success-stories": SuccessStoryItem;
};

export type AcademyModuleRecord =
  AcademyModuleRecordBySlug[keyof AcademyModuleRecordBySlug];

export const academyModuleRegistry = {
  services: {
    dataKey: "services",
    label: "Services",
    description: "Programs, class formats, and fee highlights.",
  },
  events: {
    dataKey: "events",
    label: "Events",
    description: "Upcoming showcases, workshops, and competitions.",
  },
  gallery: {
    dataKey: "gallery",
    label: "Gallery",
    description: "Images and videos from academy moments.",
  },
  faqs: {
    dataKey: "faqs",
    label: "FAQs",
    description: "Answers for parents, students, and walk-ins.",
  },
  blog: {
    dataKey: "blog",
    label: "Blog",
    description: "Articles and updates from the academy.",
  },
  "success-stories": {
    dataKey: "successStories",
    label: "Success Stories",
    description: "Student wins and transformation stories.",
  },
} as const satisfies Record<
  AcademyCollectionSlug,
  {
    dataKey: keyof AcademyContentData;
    label: string;
    description: string;
  }
>;

export function isAcademyCollectionSlug(
  value: string,
): value is AcademyCollectionSlug {
  return value in academyModuleRegistry;
}

function createBaseRecord(id: string, createdAt: string): ContentItemBase {
  return {
    id,
    createdAt,
    updatedAt: createdAt,
    published: true,
  };
}

export function createSeedContent(): AcademyContentData {
  const seededAt = "2026-04-04T09:00:00.000Z";

  return {
    services: [
      {
        ...createBaseRecord("service-kids-foundation", seededAt),
        title: "Kids Foundation Batch",
        slug: "kids-foundation-batch",
        summary: "Rhythm, confidence, and coordination for dancers age 3+.",
        description:
          "A playful beginner-focused class that helps younger dancers learn timing, body awareness, and stage comfort through structured routines.",
        ageGroup: "3-8 years",
        priceLabel: "Starts at Rs. 1,200 / month",
        imageUrl: "/dance-poster.svg",
        featured: true,
      },
      {
        ...createBaseRecord("service-performance-crew", seededAt),
        title: "Performance Crew Training",
        slug: "performance-crew-training",
        summary: "High-energy practice for stage shows and competition prep.",
        description:
          "An intermediate to advanced track focused on choreography retention, expression, cleaner formations, and performance stamina.",
        ageGroup: "9+ years",
        priceLabel: "Custom batch pricing",
        imageUrl: "/hero-dance.mp4",
        featured: true,
      },
    ],
    events: [
      {
        ...createBaseRecord("event-summer-showcase-2026", seededAt),
        title: "Summer Showcase 2026",
        slug: "summer-showcase-2026",
        summary: "Academy performance night featuring kids and team routines.",
        description:
          "An annual showcase built for student stage exposure, parent attendance, and highlight reel moments.",
        date: "2026-06-20T17:30:00.000Z",
        location: "Baranagar Community Hall",
        registrationUrl: "https://example.com/register/summer-showcase-2026",
        bannerUrl: "/dance-poster.svg",
        status: "upcoming",
        featured: true,
      },
      {
        ...createBaseRecord("event-open-workshop-locking", seededAt),
        title: "Open Locking Workshop",
        slug: "open-locking-workshop",
        summary: "Weekend special workshop for groove, bounce, and freestyle.",
        description:
          "A one-day workshop for academy students and outside participants to build musicality and freestyle confidence.",
        date: "2026-05-10T11:00:00.000Z",
        location: "Danger Dance Academy Studio",
        registrationUrl: "https://example.com/register/open-locking-workshop",
        bannerUrl: "/hero-dance.mp4",
        status: "upcoming",
        featured: false,
      },
    ],
    gallery: [
      {
        ...createBaseRecord("gallery-stage-pose-1", seededAt),
        title: "Stage Pose Portrait",
        category: "Performances",
        mediaType: "image",
        assetUrl: "/dance-poster.svg",
        thumbnailUrl: "/dance-poster.svg",
        caption: "Pre-show portrait from the academy performance team.",
        featured: true,
      },
      {
        ...createBaseRecord("gallery-rehearsal-reel", seededAt),
        title: "Rehearsal Reel",
        category: "Practice",
        mediaType: "video",
        assetUrl: "/testimonial-dance.mp4",
        thumbnailUrl: "/dance-poster.svg",
        caption: "Short rehearsal cut from an evening batch session.",
        featured: false,
      },
    ],
    faqs: [
      {
        ...createBaseRecord("faq-age-limit", seededAt),
        question: "What is the minimum age for joining?",
        answer:
          "We accept children from age 3 onward in the beginner foundation batches.",
        category: "Admissions",
      },
      {
        ...createBaseRecord("faq-trial-class", seededAt),
        question: "Do you offer a trial class?",
        answer:
          "Yes. Parents can book a trial session first to understand the batch style and trainer approach.",
        category: "Classes",
      },
      {
        ...createBaseRecord("faq-competition-prep", seededAt),
        question: "Do you train students for stage shows and competitions?",
        answer:
          "Yes. We run special choreography and performance prep tracks for events, competitions, and academy showcases.",
        category: "Performance",
      },
    ],
    blog: [
      {
        ...createBaseRecord("blog-building-stage-confidence", seededAt),
        title: "How Young Dancers Build Stage Confidence",
        slug: "how-young-dancers-build-stage-confidence",
        excerpt:
          "Stage confidence is trained, not gifted. Here is how regular batches shape it.",
        content:
          "Consistent practice, repetition, and supportive feedback make a major difference in how children perform on stage. Dance training helps students become more comfortable in front of people, improve timing, and recover quickly when they miss a step.",
        coverImageUrl: "/dance-poster.svg",
        author: "Danger Dance Academy Team",
        readingTime: "4 min read",
        publishedAt: "2026-04-04T09:00:00.000Z",
      },
      {
        ...createBaseRecord("blog-why-hip-hop-works-for-kids", seededAt),
        title: "Why Hip Hop Works Well for Kids",
        slug: "why-hip-hop-works-well-for-kids",
        excerpt:
          "Hip hop gives younger students a fun way to learn rhythm and control.",
        content:
          "Because hip hop blends groove, repetition, and performance energy, it keeps younger dancers engaged while still teaching them body control, discipline, and awareness of music.",
        coverImageUrl: "/hero-dance.mp4",
        author: "Surya Sir",
        readingTime: "3 min read",
        publishedAt: "2026-04-03T09:00:00.000Z",
      },
    ],
    successStories: [
      {
        ...createBaseRecord("story-ananya-stage-debut", seededAt),
        studentName: "Ananya Das",
        slug: "ananya-stage-debut",
        headline: "From shy beginner to front-row showcase performer",
        story:
          "Ananya joined the kids batch with low confidence and gradually became one of the most reliable performers in the academy showcase team.",
        achievement: "Lead performer in academy summer showcase",
        yearJoined: 2024,
        photoUrl: "/logo.jpeg",
        featured: true,
      },
      {
        ...createBaseRecord("story-riddhi-competition-podium", seededAt),
        studentName: "Riddhi Saha",
        slug: "riddhi-competition-podium",
        headline: "Competition podium after focused choreography prep",
        story:
          "Riddhi spent months sharpening expressions, transitions, and performance discipline before securing a podium finish at an inter-school event.",
        achievement: "Placed in inter-school dance competition",
        yearJoined: 2023,
        photoUrl: "/logo.jpeg",
        featured: true,
      },
    ],
  };
}
