"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { academyData } from "@/lib/academy";
import {
  createFadeUp,
  heroContentVariants,
  heroTitleVariants,
  heroViewport,
  heroWordVariants,
} from "@/lib/animationVariants";

const heroTitleLines = [["Danger"], ["Dance", "Academy"]];
const heroSocialLinks = academyData.socialPlatforms.filter(
  (item) => (item.platform === "youtube" || item.platform === "instagram") && "href" in item,
);
const heroTextVariants = createFadeUp(22, 0.72);
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
});

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.3 7.2a2.9 2.9 0 0 0-2-2A38 38 0 0 0 12 4.8a38 38 0 0 0-7.3.4 2.9 2.9 0 0 0-2 2A30.6 30.6 0 0 0 2.3 12c0 1.6.1 3.2.4 4.8a2.9 2.9 0 0 0 2 2 38 38 0 0 0 7.3.4 38 38 0 0 0 7.3-.4 2.9 2.9 0 0 0 2-2c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10.1 15.5V8.5l6 3.5-6 3.5Z" />
    </svg>
  );
}

function SocialIcon({
  platform,
  className,
}: {
  platform: (typeof academyData.socialPlatforms)[number]["platform"];
  className?: string;
}) {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className={className} />;
    case "youtube":
      return <YouTubeIcon className={className} />;
    default:
      return null;
  }
}

function getHeroSocialBadgeClass(platform: (typeof academyData.socialPlatforms)[number]["platform"]) {
  switch (platform) {
    case "instagram":
      return "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_52%,#6228d7_100%)] text-white";
    case "youtube":
      return "bg-[linear-gradient(135deg,#ff4c4c_0%,#c40000_100%)] text-white";
    default:
      return "bg-white text-slate-950";
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const scheduleVideoLoad = window.setTimeout(() => {
      setShouldLoadVideo(true);
    }, 180);

    return () => {
      window.clearTimeout(scheduleVideoLoad);
    };
  }, []);

  // Keep the parallax subtle so the hero feels cinematic without causing lag.
  const rawVideoY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const rawGlowY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const videoY = useSpring(rawVideoY, {
    stiffness: 120,
    damping: 26,
    mass: 0.24,
  });
  const glowY = useSpring(rawGlowY, {
    stiffness: 110,
    damping: 24,
    mass: 0.28,
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <motion.div
        className="absolute -inset-8 will-change-transform"
        style={shouldReduceMotion ? undefined : { y: videoY }}
      >
        <Image
          src="/dance-poster.svg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${isVideoReady ? "opacity-0" : "opacity-100"}`}
        />
        <video
          className={`h-full w-full object-cover transition-opacity duration-500 ${isVideoReady ? "opacity-100" : "opacity-0"}`}
          src={shouldLoadVideo ? academyData.hero.videoSrc : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/dance-poster.svg"
          onLoadedData={() => setIsVideoReady(true)}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/42" />
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={shouldReduceMotion ? undefined : { y: glowY }}
      >
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_42%),linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(7,20,47,0.5)_70%,rgba(3,10,28,0.76)_100%)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] z-[8] overflow-hidden"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, 8, 0],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 6.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      >
        <Image
          src="/all-gif/fire.gif"
          alt=""
          aria-hidden="true"
          width={1920}
          height={520}
          unoptimized
          className="h-[14rem] w-full object-cover opacity-50 mix-blend-screen sm:h-[16rem] lg:h-[18rem]"
          style={{
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 100%)",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 100%)",
            filter:
              "saturate(1.15) contrast(1.04) brightness(0.94) drop-shadow(0 -12px 34px rgba(251,146,60,0.14))",
          }}
        />
      </motion.div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl items-center justify-center px-4 pb-16 pt-28 text-center sm:px-8 sm:pb-20 sm:pt-32 lg:px-10">
        <motion.div
          variants={heroContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={heroViewport}
          className="max-w-4xl"
        >
          <motion.div
            variants={heroTextVariants}
            className="inline-flex max-w-full items-center rounded-full border border-white/[0.15] bg-white/[0.08] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-100/90 backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.32em]"
          >
            Baranagar | Dunlop | Belghoria
          </motion.div>

          <motion.h1
            variants={heroTitleVariants}
            className="mt-7 text-white"
          >
            {heroTitleLines.map((line, lineIndex) => (
              <span
                key={line.join(" ")}
                className={`block ${lineIndex === 0 ? "pb-4" : "pb-5"}`}
              >
                {line.map((word) => (
                  <span
                    key={word}
                    className="mr-[0.22em] inline-block pb-2"
                  >
                    <motion.span
                      variants={heroWordVariants}
                      className={`inline-block text-[clamp(2.75rem,15vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-[#d7efff] drop-shadow-[0_0_28px_rgba(96,165,250,0.34)] [text-shadow:0_0_24px_rgba(159,211,255,0.2)] [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] ${playfairDisplay.className}`}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>
          <motion.p
            variants={heroTextVariants}
            className="mt-4 text-balance text-base text-slate-200 sm:text-2xl"
          >
            {academyData.hero.subtitle}
          </motion.p>

          <motion.div
            variants={heroTextVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {heroSocialLinks.map((item, index) => (
              <motion.a
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-full max-w-[18rem] items-center justify-center gap-3 rounded-full border border-white/16 bg-black/30 px-3 py-2 text-left shadow-[0_12px_40px_rgba(15,23,42,0.28)] backdrop-blur-md transition hover:border-white/30 hover:bg-black/38 sm:w-auto sm:max-w-none sm:justify-start"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -5, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 2.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.28,
                      }
                }
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.28)] ${getHeroSocialBadgeClass(item.platform)}`}
                >
                  <SocialIcon platform={item.platform} className="h-6 w-6" />
                </span>
                <span className="flex flex-col pr-2">
                  <span className="text-sm font-semibold leading-none text-white sm:text-lg">
                    {item.label}
                  </span>
                  {"handle" in item && item.handle ? (
                    <span className="mt-1 text-xs leading-none text-white/80 sm:text-base">
                      {item.handle}
                    </span>
                  ) : null}
                </span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            variants={heroTextVariants}
            className="mx-auto mt-7 max-w-2xl rounded-[24px] border border-white/14 bg-[linear-gradient(135deg,rgba(15,23,42,0.62)_0%,rgba(30,41,59,0.38)_36%,rgba(14,165,233,0.18)_100%)] p-[1px] shadow-[0_20px_70px_rgba(15,23,42,0.42)] sm:rounded-[28px]"
          >
            <div className="rounded-[23px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] px-4 py-4 backdrop-blur-xl sm:rounded-[27px] sm:px-8 sm:py-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center rounded-full border border-sky-300/28 bg-sky-400/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-sky-100/90 sm:px-4 sm:text-[0.68rem] sm:tracking-[0.34em]">
                  Limited Seats
                </span>
                <p className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_38%,#bfe4ff_100%)] bg-clip-text text-[1.45rem] font-semibold uppercase tracking-[0.08em] text-transparent drop-shadow-[0_0_24px_rgba(125,211,252,0.24)] sm:text-[2.1rem] sm:tracking-[0.12em]">
                  Admission Going On...
                </p>
                <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                  <div className="relative inline-flex w-full items-start justify-center sm:w-auto sm:pr-12 sm:pt-3">
                    <a
                      href="/join"
                      className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff7d6_0%,#f5d67a_26%,#d8a73c_58%,#fff1b8_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_38px_rgba(245,158,11,0.34),inset_0_1px_0_rgba(255,255,255,0.72)] transition hover:scale-[1.02] sm:min-w-[15rem] sm:px-8 sm:tracking-[0.18em]"
                    >
                      Book Your Slot
                    </a>
                    <Image
                      src="/all-gif/littlebird1.gif"
                      alt=""
                      aria-hidden="true"
                      width={1080}
                      height={1080}
                      unoptimized
                      className="pointer-events-none absolute right-1 top-[-0.9rem] h-14 w-14 object-contain drop-shadow-[0_10px_24px_rgba(255,255,255,0.18)] sm:-right-3 sm:-top-6 sm:h-[5.5rem] sm:w-[5.5rem]"
                    />
                  </div>
                  <a
                    href={`tel:${academyData.phone}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/22 bg-white/[0.08] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_34px_rgba(15,23,42,0.24)] backdrop-blur transition hover:bg-white/[0.14] sm:min-w-[15rem] sm:px-8 sm:tracking-[0.14em]"
                  >
                    Call {academyData.phone}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* <motion.div
            variants={heroButtonsVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="/join"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-8 text-sm font-semibold text-slate-950 shadow-[0_0_48px_rgba(96,165,250,0.36)] hover:scale-[1.02]"
            >
              {academyData.hero.ctaLabel}
            </a>
            <a
              href={`tel:${academyData.phone}`}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-8 text-sm font-semibold text-white backdrop-blur hover:bg-white/[0.12]"
            >
              Call {academyData.phone}
            </a>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
