export const academyData = {
  academyName: "Danger Dance Academy Baranagar",
  shortName: "Danger Dance Academy",
  tagline: "Best dance class in Baranagar, Dunlop & Belghoria",
  hero: {
    title: "Danger Dance Academy",
    subtitle: "Unleash Your Inner Dancer",
    ctaLabel: "Join Now",
    videoSrc: "/12022733_1920_1080_30fps.mp4",
  },
  phone: "8910492292",
  socialPlatforms: [
    { label: "Instagram", platform: "instagram" },
    { label: "Facebook", platform: "facebook" },
    { label: "YouTube", platform: "youtube" },
  ],
  trainer: "Surya Sir",
  about:
    "A performance-focused dance space where beginners and young dancers build rhythm, confidence, stage presence, and technique in a supportive environment.",
  navItems: [
    { label: "About", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Reviews", href: "#reviews" },
    { label: "3D Experience", href: "#experience" },
    { label: "Join", href: "#join" },
  ],
  highlights: [
    {
      title: "Kids Specialist",
      description:
        "Structured, playful sessions for children age 3+ to grow confidence and coordination.",
    },
    {
      title: "Multiple Styles",
      description:
        "Hip hop, ballet, and modern dance training built into an energetic academy workflow.",
    },
    {
      title: "Expert Trainer",
      description:
        "Train under Surya Sir with attention to basics, expression, musicality, and stage polish.",
    },
  ],
  stats: [
    { label: "Starting Age", value: "3+" },
    { label: "Popular Styles", value: "Hip Hop, Ballet, Modern" },
    { label: "Lead Mentor", value: "Surya Sir" },
  ],
  videoTestimonials: [
    {
      name: "Akash Dey",
      quote: "Best dance class in Baranagar.",
      videoSrc: "/testimonial-dance.mp4",
    },
    {
      name: "Sukanya",
      quote: "Surya sir is awesome.",
      videoSrc: "/hero-dance.mp4",
    },
    {
      name: "Dimple Sharma",
      quote: "Great environment and vibe.",
      videoSrc: "/testimonial-dance.mp4",
    },
  ],
  reviews: [
    {
      author: "Akash Dey",
      text: "Best dance class in Baranagar",
      rating: 5,
    },
    {
      author: "Sukanya",
      text: "Surya sir is awesome",
      rating: 5,
    },
    {
      author: "Dimple Sharma",
      text: "Great environment and vibe",
      rating: 5,
    },
  ],
} as const;
