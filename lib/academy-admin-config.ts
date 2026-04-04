import type { AcademyCollectionSlug } from "@/lib/academy-cms";

export type AcademyAdminField = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "datetime"
    | "image";
  placeholder?: string;
  helpText?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

export type AcademyAdminFormValue = string | number | boolean;
export type AcademyAdminFormState = Record<string, AcademyAdminFormValue>;

export const academyAdminFields: Record<
  AcademyCollectionSlug,
  AcademyAdminField[]
> = {
  services: [
    { name: "title", label: "Title", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      helpText: "Leave blank to auto-generate from title.",
    },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "ageGroup", label: "Age Group", type: "text" },
    { name: "priceLabel", label: "Price Label", type: "text" },
    { name: "imageUrl", label: "Image", type: "image" },
    { name: "published", label: "Published", type: "checkbox" },
    { name: "featured", label: "Featured", type: "checkbox" },
  ],
  events: [
    { name: "title", label: "Title", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      helpText: "Leave blank to auto-generate from title.",
    },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "date", label: "Event Date", type: "datetime" },
    { name: "location", label: "Location", type: "text" },
    { name: "registrationUrl", label: "Registration URL", type: "text" },
    { name: "bannerUrl", label: "Banner Image", type: "image" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { name: "published", label: "Published", type: "checkbox" },
    { name: "featured", label: "Featured", type: "checkbox" },
  ],
  gallery: [
    { name: "title", label: "Title", type: "text" },
    { name: "category", label: "Category", type: "text" },
    {
      name: "mediaType",
      label: "Media Type",
      type: "select",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    { name: "assetUrl", label: "Asset URL", type: "image" },
    { name: "thumbnailUrl", label: "Thumbnail", type: "image" },
    { name: "caption", label: "Caption", type: "textarea" },
    { name: "published", label: "Published", type: "checkbox" },
    { name: "featured", label: "Featured", type: "checkbox" },
  ],
  faqs: [
    { name: "question", label: "Question", type: "text" },
    { name: "answer", label: "Answer", type: "textarea" },
    { name: "category", label: "Category", type: "text" },
    { name: "published", label: "Published", type: "checkbox" },
  ],
  blog: [
    { name: "title", label: "Title", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      helpText: "Leave blank to auto-generate from title.",
    },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "content", label: "Content", type: "textarea" },
    { name: "coverImageUrl", label: "Cover Image", type: "image" },
    { name: "author", label: "Author", type: "text" },
    { name: "readingTime", label: "Reading Time", type: "text" },
    { name: "publishedAt", label: "Published At", type: "datetime" },
    { name: "published", label: "Published", type: "checkbox" },
  ],
  "success-stories": [
    { name: "studentName", label: "Student Name", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      helpText: "Leave blank to auto-generate from student name.",
    },
    { name: "headline", label: "Headline", type: "text" },
    { name: "story", label: "Story", type: "textarea" },
    { name: "achievement", label: "Achievement", type: "text" },
    { name: "yearJoined", label: "Year Joined", type: "number" },
    { name: "photoUrl", label: "Photo", type: "image" },
    { name: "published", label: "Published", type: "checkbox" },
    { name: "featured", label: "Featured", type: "checkbox" },
  ],
};

export const academyAdminDefaults: Record<
  AcademyCollectionSlug,
  AcademyAdminFormState
> = {
  services: {
    title: "",
    slug: "",
    summary: "",
    description: "",
    ageGroup: "",
    priceLabel: "",
    imageUrl: "",
    published: true,
    featured: false,
  },
  events: {
    title: "",
    slug: "",
    summary: "",
    description: "",
    date: "",
    location: "",
    registrationUrl: "",
    bannerUrl: "",
    status: "upcoming",
    published: true,
    featured: false,
  },
  gallery: {
    title: "",
    category: "",
    mediaType: "image",
    assetUrl: "",
    thumbnailUrl: "",
    caption: "",
    published: true,
    featured: false,
  },
  faqs: {
    question: "",
    answer: "",
    category: "",
    published: true,
  },
  blog: {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    author: "",
    readingTime: "",
    publishedAt: "",
    published: true,
  },
  "success-stories": {
    studentName: "",
    slug: "",
    headline: "",
    story: "",
    achievement: "",
    yearJoined: new Date().getFullYear(),
    photoUrl: "",
    published: true,
    featured: false,
  },
};

export const academyAdminIdentityField: Record<AcademyCollectionSlug, string> = {
  services: "title",
  events: "title",
  gallery: "title",
  faqs: "question",
  blog: "title",
  "success-stories": "studentName",
};

export const academyAdminUploadFolder: Record<AcademyCollectionSlug, string> = {
  services: "danger-dance-academy/services",
  events: "danger-dance-academy/events",
  gallery: "danger-dance-academy/gallery",
  faqs: "danger-dance-academy/faqs",
  blog: "danger-dance-academy/blog",
  "success-stories": "danger-dance-academy/success-stories",
};
