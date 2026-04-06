"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Sparkles, Star, X } from "lucide-react";
import {
  createFadeUp,
  createStaggerContainer,
  sectionBodyVariants,
  sectionContentVariants,
  sectionHeadingVariants,
  sectionViewport,
} from "@/lib/animationVariants";

const categoryVariants = createStaggerContainer(0.12, 0.06);
const cardVariants = createFadeUp(22, 0.68);

const danceCategories = [
  {
    id: "world-best",
    label: "World Best Dance Style",
    eyebrow: "Global favourites",
    description:
      "Signature forms that build strong technique, body control, musicality, and polished stage presence.",
    styles: [
      {
        name: "Ballet",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/hero-dance.mp4",
      },
      {
        name: "Hip Hop",
        imageSrc: "/logo.jpeg",
        videoSrc: "/testimonial-dance.mp4",
      },
      {
        name: "Contemporary",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/about.mp4",
      },
      {
        name: "Bachata",
        imageSrc: "/logo.jpeg",
        videoSrc: "/demo-reel.mp4",
      },
      {
        name: "Ballroom",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/12022733_1920_1080_30fps.mp4",
      },
      {
        name: "K-Pop",
        imageSrc: "/logo.jpeg",
        videoSrc: "/dangerDanceAcademy.mp4",
      },
    ],
  },
  {
    id: "others",
    label: "Other Dance Styles",
    eyebrow: "Popular performance picks",
    description:
      "Fast-moving crowd favourites for functions, reels, social content, and versatile stage choreography.",
    styles: [
      {
        name: "Freestyle",
        imageSrc: "/logo.jpeg",
        videoSrc: "/demo-reel.mp4",
      },
      {
        name: "Bollywood Style",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/hero-dance.mp4",
      },
      {
        name: "Bollywood Item",
        imageSrc: "/logo.jpeg",
        videoSrc: "/testimonial-dance.mp4",
      },
      {
        name: "Reels",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/about.mp4",
      },
      {
        name: "Fusion",
        imageSrc: "/logo.jpeg",
        videoSrc: "/dangerDanceAcademy.mp4",
      },
      {
        name: "Tollywood",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/12022733_1920_1080_30fps.mp4",
      },
      {
        name: "Retro",
        imageSrc: "/logo.jpeg",
        videoSrc: "/demo-reel.mp4",
      },
    ],
  },
  {
    id: "traditional",
    label: "Traditional Style",
    eyebrow: "Rooted in heritage",
    description:
      "Classical training designed to strengthen grace, discipline, expressions, footwork, and cultural understanding.",
    styles: [
      {
        name: "Classical",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/about.mp4",
      },
      {
        name: "Semi Classical",
        imageSrc: "/logo.jpeg",
        videoSrc: "/hero-dance.mp4",
      },
      {
        name: "Bharat Natyam",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/dangerDanceAcademy.mp4",
      },
      {
        name: "Kathak",
        imageSrc: "/logo.jpeg",
        videoSrc: "/12022733_1920_1080_30fps.mp4",
      },
      {
        name: "Folk",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/testimonial-dance.mp4",
      },
    ],
  },
  {
    id: "learn-earn",
    label: "Learn And Earn",
    eyebrow: "Career and event track",
    description:
      "Practical training for dancers who want to perform, teach, choreograph, and work on live-event assignments.",
    styles: [
      {
        name: "Choreography Training",
        imageSrc: "/logo.jpeg",
        videoSrc: "/dangerDanceAcademy.mp4",
      },
      {
        name: "Zumba Training",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/demo-reel.mp4",
      },
      {
        name: "Sangeet",
        imageSrc: "/logo.jpeg",
        videoSrc: "/hero-dance.mp4",
      },
      {
        name: "Corporate Event",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/12022733_1920_1080_30fps.mp4",
      },
      {
        name: "Private Event",
        imageSrc: "/logo.jpeg",
        videoSrc: "/about.mp4",
      },
      {
        name: "Birthday Party",
        imageSrc: "/chairman.jpeg",
        videoSrc: "/testimonial-dance.mp4",
      },
      {
        name: "Award Show",
        imageSrc: "/logo.jpeg",
        videoSrc: "/dangerDanceAcademy.mp4",
      },
    ],
  },
] as const;

const spotlightPoints = [
  "Annual show performance platform",
  "Diploma and certificate provided",
  "Examination facility available",
  "Stage preparation and costume guidance",
  "Beginner-friendly batches with growth tracking",
  "Event choreography support for real performances",
] as const;

export function DanceStylesSection() {
  const [activeCategoryId, setActiveCategoryId] = useState(danceCategories[0].id);
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoSrc: string;
  } | null>(null);

  const activeCategory =
    danceCategories.find((category) => category.id === activeCategoryId) ?? danceCategories[0];

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="relative overflow-hidden rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(7,16,34,0.96)_0%,rgba(10,27,52,0.94)_45%,rgba(6,15,30,0.98)_100%)] p-6 shadow-[0_32px_100px_rgba(2,8,23,0.34)] sm:p-8 lg:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_34%),radial-gradient(circle_at_85%_14%,_rgba(251,191,36,0.14),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_32%)]" />

        <div className="relative z-10">
          <motion.p
            variants={sectionHeadingVariants}
            className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/74"
          >
            Dance Programs
          </motion.p>
          <motion.div
            variants={sectionContentVariants}
            className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <motion.h2
                variants={sectionHeadingVariants}
                className="font-display text-4xl text-white sm:text-5xl"
              >
                Explore styles, watch previews, and choose the right training path.
              </motion.h2>
              <motion.p
                variants={sectionBodyVariants}
                className="mt-4 max-w-2xl text-base leading-8 text-slate-300/86"
              >
                Select a dance type below, then open any style card to preview a sample video.
                Placeholder clips are used for now and can be replaced with final class reels later.
              </motion.p>
            </div>

            <motion.div
              variants={sectionBodyVariants}
              className="inline-flex items-center gap-3 self-start rounded-full border border-cyan-200/18 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/86"
            >
              <Sparkles className="h-4 w-4" />
              Click Any Card To Watch
            </motion.div>
          </motion.div>

          <motion.div
            variants={categoryVariants}
            className="scrollbar-thin mt-10 flex gap-4 overflow-x-auto pb-2"
          >
            {danceCategories.map((category, index) => {
              const isActive = category.id === activeCategory.id;

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  variants={cardVariants}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`group min-w-[17rem] shrink-0 rounded-[24px] border p-4 text-left transition sm:min-w-[19rem] ${
                    isActive
                      ? "border-sky-300/40 bg-[linear-gradient(135deg,rgba(56,189,248,0.22)_0%,rgba(14,165,233,0.12)_100%)] shadow-[0_24px_55px_rgba(14,165,233,0.16)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-100/56">
                        {category.eyebrow}
                      </p>
                      <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">
                        {category.label}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                        isActive
                          ? "border-sky-200/40 bg-white/12 text-white"
                          : "border-white/10 bg-white/6 text-slate-300"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="mt-8">
            <motion.div
              key={activeCategory.id}
              initial="hidden"
              animate="visible"
              variants={categoryVariants}
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)] p-4 sm:p-5"
              >
                <div className="mb-5 flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/62">
                    {activeCategory.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-white">
                    {activeCategory.label}
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-300/78">
                  {activeCategory.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {activeCategory.styles.map((style) => (
                  <motion.button
                    key={`${activeCategory.id}-${style.name}`}
                    type="button"
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    onClick={() =>
                      setActiveVideo({
                        title: style.name,
                        videoSrc: style.videoSrc,
                      })
                    }
                    className="group overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/46 text-left shadow-[0_18px_44px_rgba(2,8,23,0.24)] transition hover:border-sky-200/26"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={style.imageSrc}
                        alt={style.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.76)_100%)]" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/28 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/84 backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 text-amber-300" />
                        Demo Clip
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <h4 className="font-display text-2xl text-white">
                          {style.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-300/72">
                          Tap to open preview video
                        </p>
                      </div>
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/14 bg-sky-300/14 text-sky-100 transition group-hover:scale-105 group-hover:border-sky-100/26 group-hover:bg-sky-300/18">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={categoryVariants}
            className="mt-10 rounded-[32px] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.12)_0%,rgba(56,189,248,0.12)_44%,rgba(14,165,233,0.1)_100%)] p-5 shadow-[0_22px_60px_rgba(14,165,233,0.12)] sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-amber-200/78">
                  Why Families Choose This Academy
                </p>
                <h3 className="mt-2 font-display text-3xl text-white">
                  More than classes. A complete stage-ready journey.
                </h3>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-100/76">
                These are the promises students and parents notice immediately when they join the
                academy.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {spotlightPoints.map((point) => (
                <motion.div
                  key={point}
                  variants={cardVariants}
                  className="rounded-[24px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-slate-950">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <p className="text-base font-semibold leading-7 text-white">
                      {point}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeVideo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/88 px-4 py-8 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(10,18,35,0.98)_0%,rgba(4,10,24,0.98)_100%)] shadow-[0_30px_120px_rgba(2,8,23,0.58)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/68">
                    Preview Video
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-white">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-white/20 hover:bg-white/10"
                  aria-label="Close video modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-5">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
                  <video
                    key={activeVideo.videoSrc}
                    src={activeVideo.videoSrc}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full bg-black object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
