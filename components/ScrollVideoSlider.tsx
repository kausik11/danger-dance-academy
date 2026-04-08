"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { sliderData } from "@/data/sliderData";
import { useActiveVideo } from "@/hooks/useActiveVideo";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_SENSITIVITY = 0.95;

function clampIndex(index: number) {
  return Math.max(0, Math.min(sliderData.length - 1, index));
}

export function ScrollVideoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isSectionActiveRef = useRef(false);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeSlide = sliderData[activeIndex];
  const progressPercent = ((activeIndex + 1) / sliderData.length) * 100;
  const { registerVideo } = useActiveVideo(activeSlide.id);

  const updateActiveIndex = useCallback((nextIndex: number) => {
    const clampedIndex = clampIndex(nextIndex);
    if (clampedIndex === activeIndexRef.current) {
      return;
    }

    setDirection(clampedIndex > activeIndexRef.current ? 1 : -1);
    activeIndexRef.current = clampedIndex;
    setActiveIndex(clampedIndex);
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const clampedIndex = clampIndex(index);
    const trigger = triggerRef.current;

    if (!trigger) {
      updateActiveIndex(clampedIndex);
      return;
    }

    const targetProgress =
      sliderData.length === 1 ? 0 : clampedIndex / (sliderData.length - 1);
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;

    window.scrollTo({
      top: targetScroll,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [shouldReduceMotion, updateActiveIndex]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section || !panel) {
      return;
    }

    const totalSlides = sliderData.length;
    const snapStep = totalSlides > 1 ? 1 / (totalSlides - 1) : 1;

    const context = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: panel,
        start: "center center",
        end: () => `+=${panel.offsetHeight * (totalSlides - 1) * SCROLL_SENSITIVITY}`,
        anticipatePin: 1,
        scrub: shouldReduceMotion ? false : 1.1,
        invalidateOnRefresh: true,
        snap: shouldReduceMotion
          ? undefined
          : {
              snapTo: (progress: number) => Math.round(progress / snapStep) * snapStep,
              duration: { min: 0.22, max: 0.55 },
              delay: 0.04,
              ease: "power3.inOut",
            },
        onToggle: (self) => {
          isSectionActiveRef.current = self.isActive;
        },
        onUpdate: (self) => {
          const nextIndex = clampIndex(Math.round(self.progress * (totalSlides - 1)));
          if (nextIndex !== activeIndexRef.current) {
            updateActiveIndex(nextIndex);
          }
        },
      });

      triggerRef.current = trigger;
    }, section);

    return () => {
      triggerRef.current = null;
      context.revert();
    };
  }, [shouldReduceMotion, updateActiveIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isSectionActiveRef.current) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        scrollToSlide(activeIndexRef.current + 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        scrollToSlide(activeIndexRef.current - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollToSlide]);

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll driven video slider"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[linear-gradient(180deg,#13061d_0%,#18081f_35%,#090311_100%)] py-8 sm:py-10 lg:py-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(251,113,133,0.14),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_center,rgba(168,85,247,0.12),transparent_32%)]" />
        <div className="absolute left-[8%] top-[8%] h-28 w-28 rounded-full border border-white/14 bg-white/[0.04] shadow-[0_0_0_8px_rgba(255,255,255,0.03)] backdrop-blur-md sm:h-20 sm:w-20" />
      </div>

      <div className="relative w-full px-3 sm:px-6 lg:px-8">
        <div
          ref={panelRef}
          className="relative h-[34rem] w-full overflow-hidden rounded-[30px] border border-white/10 bg-black/24 shadow-[0_40px_140px_rgba(2,6,23,0.45)] sm:h-[38rem] sm:rounded-[36px] lg:h-[42rem] xl:h-[46rem]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_18%)]" />

          <div className="absolute inset-0">
            {sliderData.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={slide.id}
                  animate={
                    shouldReduceMotion
                      ? {
                          opacity: isActive ? 1 : 0,
                        }
                      : {
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1.02 : index < activeIndex ? 0.93 : 1.12,
                          x: isActive ? 0 : index < activeIndex ? -90 : 90,
                          y: isActive ? 0 : index < activeIndex ? -24 : 24,
                          filter: isActive ? "blur(0px)" : "blur(16px)",
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.18 : 0.95,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`absolute inset-0 ${isActive ? "z-20" : "z-10"}`}
                  aria-hidden={!isActive}
                >
                  <motion.video
                    ref={registerVideo(slide.id)}
                    src={slide.videoSrc}
                    poster={slide.posterSrc}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: isActive ? 1.08 : 1.02,
                          }
                    }
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,2,12,0.12)_0%,rgba(10,6,20,0.22)_32%,rgba(9,7,17,0.72)_72%,rgba(7,3,12,0.94)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.12),transparent_16%),radial-gradient(circle_at_76%_26%,rgba(244,114,182,0.18),transparent_22%),radial-gradient(circle_at_20%_74%,rgba(56,189,248,0.16),transparent_18%)]" />
                </motion.div>
              );
            })}
          </div>

          <div className="relative z-30 flex h-full flex-col justify-between p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/84 backdrop-blur-xl">
                <Play className="h-3.5 w-3.5 fill-current" />
                Best Performance Video
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSlide(activeIndex - 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-300/35 bg-[linear-gradient(135deg,rgba(56,189,248,0.28)_0%,rgba(14,165,233,0.52)_52%,rgba(2,132,199,0.72)_100%)] text-white shadow-[0_14px_32px_rgba(14,165,233,0.34)] backdrop-blur-xl transition hover:scale-[1.04] hover:border-sky-200/55 hover:shadow-[0_18px_38px_rgba(14,165,233,0.42)] focus:outline-none focus:ring-2 focus:ring-sky-300/70"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSlide(activeIndex + 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/35 bg-[linear-gradient(135deg,rgba(251,191,36,0.28)_0%,rgba(249,115,22,0.52)_52%,rgba(217,119,6,0.72)_100%)] text-white shadow-[0_14px_32px_rgba(249,115,22,0.32)] backdrop-blur-xl transition hover:scale-[1.04] hover:border-amber-200/55 hover:shadow-[0_18px_38px_rgba(249,115,22,0.42)] focus:outline-none focus:ring-2 focus:ring-amber-300/70"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-4xl">
                <AnimatePresence initial={false} mode="wait" custom={direction}>
                  <motion.div
                    key={activeSlide.id}
                    custom={direction}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: direction > 0 ? 64 : -64,
                            y: 26,
                          }
                    }
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            x: direction > 0 ? -44 : 44,
                            y: -20,
                          }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0.18 : 0.72,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.34em] text-sky-100/70">
                      {activeSlide.subtitle}
                    </p>
                    <h2 className="mt-3 max-w-4xl text-[2.85rem] font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[6.4rem]">
                      {activeSlide.title}
                    </h2>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/82 sm:text-base">
                      <span>{activeSlide.year}</span>
                      <span className="hidden text-white/32 sm:inline">|</span>
                      <span>{activeSlide.genre}</span>
                      <span className="hidden text-white/32 sm:inline">|</span>
                      <span>{activeSlide.duration}</span>
                    </div>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/82 sm:text-base">
                      {activeSlide.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="hidden items-center gap-4 lg:flex">
                <div
                  className="rounded-full p-[2px]"
                  style={{
                    background: `conic-gradient(rgba(125,211,252,0.95) ${progressPercent}%, rgba(255,255,255,0.12) ${progressPercent}% 100%)`,
                  }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/42 text-center backdrop-blur-xl">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-white/60">Active</p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {String(activeIndex + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-36">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-sky-100/60">
                    Progress
                  </p>
                  <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: shouldReduceMotion ? 0.18 : 0.55, ease: "easeOut" }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#7dd3fc_0%,#f9a8d4_52%,#fde68a_100%)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {sliderData.map((slide, index) => {
                  const isActive = slide.id === activeSlide.id;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => scrollToSlide(index)}
                      className={`group relative shrink-0 overflow-hidden rounded-[22px] border text-left transition focus:outline-none focus:ring-2 focus:ring-sky-300/60 ${
                        isActive
                          ? "h-32 w-[13rem] border-sky-300/55 bg-white/[0.1] shadow-[0_20px_48px_rgba(56,189,248,0.22)]"
                          : "h-32 w-[8rem] border-white/10 bg-black/18 opacity-78 hover:opacity-100"
                      }`}
                      aria-label={`Go to ${slide.title}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <div className="relative h-full">
                        <Image
                          src={slide.thumbSrc}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 128px, 208px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,14,0.08)_0%,rgba(7,5,14,0.24)_42%,rgba(7,5,14,0.88)_100%)]" />
                        {isActive ? (
                          <div className="absolute inset-0 border border-sky-200/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" />
                        ) : null}
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                          <span className="text-2xl font-semibold leading-none text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {isActive ? (
                            <div
                              className="rounded-full p-[2px]"
                              style={{
                                background: "conic-gradient(rgba(255,255,255,0.95) 0deg, rgba(255,255,255,0.16) 360deg)",
                              }}
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                                <span className="h-3.5 w-3.5 rounded-full border-2 border-white" />
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
