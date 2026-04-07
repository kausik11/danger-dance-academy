"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Sparkles, Star, X } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaAward,
  FaChildReaching,
  FaClipboardCheck,
  FaMasksTheater,
  FaPersonChalkboard,
  FaUserGraduate,
} from "react-icons/fa6";
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

const spotlightPoints: Array<{ label: string; icon: IconType }> = [
  {
    label: "Annual show performance platform",
    icon: FaMasksTheater,
  },
  {
    label: "Diploma and certificate provided",
    icon: FaAward,
  },
  {
    label: "Examination facility available",
    icon: FaClipboardCheck,
  },
  {
    label: "Stage preparation and costume guidance",
    icon: FaUserGraduate,
  },
  {
    label: "Beginner-friendly batches with growth tracking",
    icon: FaChildReaching,
  },
  {
    label: "Event choreography support for real performances",
    icon: FaPersonChalkboard,
  },
] as const;

type DanceCategoryId = (typeof danceCategories)[number]["id"];

export function DanceStylesSection() {
  const [activeCategoryId, setActiveCategoryId] = useState<DanceCategoryId>(
    danceCategories[0].id,
  );
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoSrc: string;
  } | null>(null);

  const activeCategory =
    danceCategories.find((category) => category.id === activeCategoryId) ?? danceCategories[0];
  const totalStyleCount = danceCategories.reduce(
    (count, category) => count + category.styles.length,
    0,
  );

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
    <section className="relative mx-auto max-w-[92rem] px-6 py-20 sm:px-8 lg:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="relative overflow-hidden rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(7,16,34,0.96)_0%,rgba(10,27,52,0.94)_45%,rgba(6,15,30,0.98)_100%)] p-6 shadow-[0_32px_100px_rgba(2,8,23,0.34)] sm:p-8 lg:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_34%),radial-gradient(circle_at_85%_14%,_rgba(251,191,36,0.14),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_32%)]" />

        <div className="relative z-10">
          <motion.div
            variants={sectionContentVariants}
            className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_20rem] xl:items-end"
          >
            <div className="max-w-4xl">
              <motion.p
                variants={sectionHeadingVariants}
                className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/74"
              >
                Dance Programs
              </motion.p>
              <motion.h2
                variants={sectionHeadingVariants}
                className="mt-4 max-w-5xl font-display text-[2.4rem] leading-[0.98] text-white sm:text-[3.3rem]"
              >
                Explore styles, watch previews, and choose the right training path.
              </motion.h2>
              <motion.p
                variants={sectionBodyVariants}
                className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/78 sm:text-[15px]"
              >
                Pick a program group, scan the styles instantly, and open any card to watch a
                sample preview. The layout is tuned to keep more options visible at once.
              </motion.p>
            </div>
            <motion.div
              variants={sectionBodyVariants}
              className="pointer-events-none relative hidden min-h-[11rem] items-end justify-end xl:flex"
            >
              <div className="relative h-[12rem] w-[12rem]">
                <Image
                  src="/all-gif/animation_spider.gif"
                  alt=""
                  aria-hidden="true"
                  fill
                  unoptimized
                  sizes="192px"
                  className="object-contain object-right-bottom opacity-90"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={categoryVariants}
            className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4"
          >
            {danceCategories.map((category, index) => {
              const isActive = category.id === activeCategory.id;

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  variants={cardVariants}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`group rounded-[26px] border p-4 text-left transition ${
                    isActive
                      ? "border-sky-300/40 bg-[linear-gradient(135deg,rgba(56,189,248,0.24)_0%,rgba(14,165,233,0.12)_100%)] shadow-[0_24px_55px_rgba(14,165,233,0.16)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-sky-100/56">
                        {category.eyebrow}
                      </p>
                      <h3 className="mt-2 font-display text-[1.65rem] leading-none text-white">
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
                  <div className="mt-4">
                    <p className="min-w-0 text-xs leading-6 text-slate-300/72">
                      {category.description}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <span className="relative inline-flex shrink-0 overflow-hidden rounded-[18px] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_18%,rgba(245,158,11,0.16)_52%,rgba(125,211,252,0.14)_100%)] px-3 py-2 shadow-[0_14px_34px_rgba(2,8,23,0.22)]">
                        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_42%)]" />
                        <span className="relative flex items-end gap-2 whitespace-nowrap">
                          <span className="font-display text-[1.15rem] leading-none text-white">
                            {String(category.styles.length).padStart(2, "0")}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-amber-100/80">
                            Styles
                          </span>
                        </span>
                      </span>
                    </div>
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
              className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)] p-4 sm:p-5 lg:p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/8 pb-5">
                  <div className="min-w-0 max-w-3xl">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-sky-200/62">
                      {activeCategory.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-[2.15rem] leading-none text-white">
                      {activeCategory.label}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300/78">
                      {activeCategory.description}
                    </p>
                  </div>
                  <div className="relative w-[15.5rem] shrink-0 self-center">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src="/all-gif/dezyne_3d-dance-21994.gif"
                        alt=""
                        aria-hidden="true"
                        fill
                        unoptimized
                        sizes="200px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        Visible Now
                      </p>
                      <p className="mt-2 font-display text-3xl text-white">
                        {activeCategory.styles.length}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        Tap Action
                      </p>
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
                        Watch
                      </p>
                    </div>
                  </div> */}
                </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {activeCategory.styles.map((style, styleIndex) => (
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
                    className="group overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/48 text-left shadow-[0_18px_44px_rgba(2,8,23,0.24)] transition hover:border-sky-200/26"
                  >
                    <div className="relative aspect-[4/4.7] overflow-hidden">
                      <Image
                        src={style.imageSrc}
                        alt={style.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.03)_0%,rgba(2,6,23,0.66)_58%,rgba(2,6,23,0.94)_100%)]" />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/28 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/84 backdrop-blur-md">
                        <Star className="h-3 w-3 text-amber-300" />
                        Demo Clip
                      </div>
                      <div className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-sky-300/14 text-sky-100 transition group-hover:scale-105 group-hover:border-sky-100/26 group-hover:bg-sky-300/18">
                        <Play className="h-4.5 w-4.5 fill-current" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="inline-flex rounded-full border border-white/10 bg-black/24 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-200/84">
                          {activeCategory.eyebrow}
                        </div>
                        <h4 className="mt-3 font-display text-[1.9rem] leading-none text-white">
                          {style.name}
                        </h4>
                        <div className="mt-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-slate-300/72">
                          <span>Style {String(styleIndex + 1).padStart(2, "0")}</span>
                          <span>Tap To Preview</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={categoryVariants}
            className="relative mt-12 overflow-hidden rounded-[36px] border border-amber-300/18 bg-[linear-gradient(135deg,rgba(9,16,31,0.96)_0%,rgba(8,18,38,0.94)_42%,rgba(6,14,27,0.98)_100%)] p-5 shadow-[0_28px_90px_rgba(2,8,23,0.34)] sm:p-6 lg:p-7"
          >
            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/all-gif/fire.gif"
                alt=""
                fill
                unoptimized
                aria-hidden="true"
                sizes="100vw"
                className="object-cover object-center opacity-40 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,20,0.18)_0%,rgba(4,10,20,0.72)_26%,rgba(4,10,20,0.9)_62%,rgba(4,10,20,0.98)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(125,211,252,0.14),transparent_26%),radial-gradient(circle_at_bottom_center,rgba(249,115,22,0.24),transparent_34%)]" />
            </div>

            <div className="relative z-10">
              <div className="grid gap-5 border-b border-white/10 pb-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)] lg:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/84">
                  Why Families Choose This Academy
                  </p>
                  <h3 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-[0.98] text-white sm:text-[3rem]">
                    More than classes. A complete stage-ready journey.
                  </h3>
                </div>
                <div className="grid gap-4">
                  <p className="max-w-xl text-sm leading-7 text-slate-100/80 sm:text-[15px]">
                    These are the promises students and parents notice immediately
                    when they join the academy.
                  </p>
                  {/* <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[22px] border border-white/12 bg-black/22 px-4 py-3 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-amber-100/64">
                        Parent Signal
                      </p>
                      <p className="mt-2 font-display text-3xl text-white">Trust</p>
                    </div>
                    <div className="rounded-[22px] border border-white/12 bg-black/22 px-4 py-3 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-amber-100/64">
                        Value Points
                      </p>
                      <p className="mt-2 font-display text-3xl text-white">
                        {spotlightPoints.length}
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {spotlightPoints.map((point, index) => {
                  const BenefitIcon = point.icon;

                  return (
                  <motion.div
                    key={point.label}
                    variants={cardVariants}
                    className="group relative overflow-hidden rounded-[26px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,15,30,0.74)_0%,rgba(10,18,35,0.62)_100%)] p-5 shadow-[0_18px_48px_rgba(2,8,23,0.24)] backdrop-blur-md transition hover:border-amber-200/22"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.08)_0%,transparent_36%,rgba(56,189,248,0.08)_100%)] opacity-80" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="grid shrink-0 gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffe07a_0%,#fbbf24_42%,#f97316_100%)] text-slate-950 shadow-[0_12px_28px_rgba(249,115,22,0.28)]">
                          <BenefitIcon className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-100/66">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300/58">
                          Stage-Ready Benefit
                        </p>
                        <p className="mt-2 text-[1.02rem] font-semibold leading-7 text-white">
                          {point.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
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
