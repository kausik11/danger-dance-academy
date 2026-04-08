export type SliderItem = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  genre: string;
  duration: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  thumbSrc: string;
};

export const sliderData: SliderItem[] = [
  {
    id: "hero-performance-reel",
    title: "Hero Performance Reel",
    subtitle: "Main stage showcase",
    year: "2026",
    genre: "Performance",
    duration: "0:29",
    description:
      "A big opening reel built for first impression: sharp lighting, full-stage movement, and a confident academy signature.",
    videoSrc: "/Video_0430.MP4",
    posterSrc: "/dance-poster.svg",
    thumbSrc: "/logo.jpeg",
  },
  {
    id: "studio-atmosphere",
    title: "Studio Atmosphere",
    subtitle: "Inside the practice floor",
    year: "2026",
    genre: "Training",
    duration: "0:24",
    description:
      "A calmer interior cut that shows the class floor, body rhythm, and the environment students experience in real sessions.",
    videoSrc: "/about.mp4",
    posterSrc: "/dance-poster.svg",
    thumbSrc: "/chairman.jpeg",
  },
  {
    id: "class-motion-preview",
    title: "Class Motion Preview",
    subtitle: "Technique in flow",
    year: "2026",
    genre: "Practice",
    duration: "0:18",
    description:
      "A movement-focused preview designed to highlight active training energy, timing, and tight group coordination.",
    videoSrc: "/hero-dance.mp4",
    posterSrc: "/dance-poster.svg",
    thumbSrc: "/dance-poster.svg",
  },
  {
    id: "demo-reel",
    title: "Demo Reel",
    subtitle: "Fast-cut academy mood",
    year: "2026",
    genre: "Showcase",
    duration: "0:22",
    description:
      "A promo-oriented reel with a quicker visual pace, useful for spotlighting range and keeping the scroll sequence dynamic.",
    videoSrc: "/demo-reel.mp4",
    posterSrc: "/dance-poster.svg",
    thumbSrc: "/logo.jpeg",
  },
  {
    id: "student-highlight",
    title: "Student Highlight",
    subtitle: "Confidence on camera",
    year: "2026",
    genre: "Spotlight",
    duration: "0:21",
    description:
      "A more personal closing slide that adds warmth, presence, and a student-first finish to the cinematic progression.",
    videoSrc: "/testimonial-dance.mp4",
    posterSrc: "/dance-poster.svg",
    thumbSrc: "/chairman.jpeg",
  },
];
