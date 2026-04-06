"use client";

import { motion } from "framer-motion";
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
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={listContainerVariants}
    >
      <motion.div
        variants={sectionHeadingVariants}
        className="max-w-3xl"
      >
        <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Reviews
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Real feedback from students and families.
        </h2>
      </motion.div>

      <motion.div variants={listContainerVariants} className="mt-10 grid gap-6 lg:grid-cols-3">
        {academyData.reviews.map((review) => (
          <motion.article
            key={review.author}
            variants={listItemVariants}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-[30px] p-6 will-change-transform"
          >
            <StarRow />
            <p className="mt-5 text-lg leading-8 text-white">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="mt-8 border-t border-white/10 pt-4">
              <p className="font-display text-xl text-white">{review.author}</p>
              <p className="mt-1 text-sm text-slate-400">Google-style review</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
