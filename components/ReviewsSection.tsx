"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { academyData } from "@/lib/academy";
import {
  listContainerVariants,
  listItemVariants,
  sectionHeadingVariants,
  sectionViewport,
} from "@/lib/animationVariants";

function StarRow() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-300"
          aria-hidden="true"
        >
          <path
            d="M12 3.75L14.5489 8.91442L20.25 9.74266L16.125 13.7633L17.0989 19.4419L12 16.7613L6.90114 19.4419L7.875 13.7633L3.75 9.74266L9.45114 8.91442L12 3.75Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <motion.section
      id="reviews"
      className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={listContainerVariants}
    >
      <motion.div
        variants={sectionHeadingVariants}
        className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-start lg:gap-4"
      >
        <div className="max-w-3xl lg:max-w-2xl">
          <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
            Reviews
          </p>
          <h2 className="mt-4 font-display text-3xl text-white sm:text-5xl">
            Real feedback from students and families.
          </h2>
        </div>

        <motion.div
          className="relative w-full max-w-[8rem] shrink-0 self-start sm:max-w-[10rem] lg:max-w-[11rem] lg:self-center"
          animate={{ y: [0, -8, 0], rotate: [0, -1.25, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-3 rounded-full bg-sky-400/24 blur-3xl" />
          <div className="absolute inset-x-6 bottom-4 h-16 rounded-full bg-amber-300/18 blur-[56px]" />
          <div className="relative aspect-square overflow-hidden rounded-full">
            <Image
              src="/all-gif/google_review.gif"
              alt="Animated Google review badge"
              width={640}
              height={640}
              unoptimized
              className="relative h-full w-full object-cover opacity-90 mix-blend-screen"
              style={{
                filter:
                  "saturate(1.18) contrast(1.08) brightness(1.03) drop-shadow(0 18px 42px rgba(56,189,248,0.14))",
                WebkitMaskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0.88) 72%, rgba(0,0,0,0.42) 86%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0.88) 72%, rgba(0,0,0,0.42) 86%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={listContainerVariants}
        className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {academyData.reviews.map((review) => (
          <motion.article
            key={review.author}
            variants={listItemVariants}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-[28px] p-5 will-change-transform sm:rounded-[30px] sm:p-6"
          >
            <StarRow />
            <p className="mt-5 text-base leading-8 text-white sm:text-lg">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="mt-8 border-t border-white/10 pt-4">
              <p className="font-display text-xl text-white">{review.author}</p>
              <p className="mt-1 text-sm text-slate-400">Google-style review</p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://share.google/dDEuwWp8TvpeSqfrj"
          className="group inline-flex w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-full border border-amber-200/34 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_16%,rgba(250,204,21,0.28)_48%,rgba(59,130,246,0.22)_100%)] px-5 py-3 text-left shadow-[0_18px_42px_rgba(2,8,23,0.28),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-amber-100/46 hover:shadow-[0_22px_50px_rgba(2,8,23,0.34),inset_0_1px_0_rgba(255,255,255,0.34)] sm:w-auto"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
            <Star className="h-5 w-5 fill-current text-amber-100" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-100/76">
              Google Business
            </span>
            <span className="mt-1 font-display text-xl leading-none text-white">
              Give A Review
            </span>
          </span>
        </a>
      </div>
    </motion.section>
  );
}
