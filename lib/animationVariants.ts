import type { Transition, Variants } from "framer-motion";

// Centralize the reveal timings so every landing-page section shares the same
// premium motion language instead of redefining transitions ad hoc.
export const sectionViewport = {
  once: true,
  amount: 0.24,
} as const;

export const heroViewport = {
  once: true,
  amount: 0.35,
} as const;

function createRevealTransition(duration = 0.75): Transition {
  return {
    duration,
    ease: "easeOut",
  };
}

export function createFadeUp(offset = 28, duration = 0.75): Variants {
  return {
    hidden: {
      opacity: 0,
      y: offset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: createRevealTransition(duration),
    },
  };
}

export function createScaleFade(offset = 28, scale = 0.985, duration = 0.8): Variants {
  return {
    hidden: {
      opacity: 0,
      y: offset,
      scale,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: createRevealTransition(duration),
    },
  };
}

export function createStaggerContainer(
  staggerChildren = 0.2,
  delayChildren = 0.08,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const sectionContentVariants = createStaggerContainer(0.16, 0.04);
export const sectionHeadingVariants = createFadeUp(24, 0.72);
export const sectionBodyVariants = createFadeUp(20, 0.7);
export const sectionMediaVariants = createScaleFade(28, 0.985, 0.82);
export const listContainerVariants = createStaggerContainer(0.2, 0.12);
export const listItemVariants = createFadeUp(26, 0.72);
export const heroContentVariants = createStaggerContainer(0.18, 0.08);
export const heroTitleVariants = createStaggerContainer(0.12, 0.12);
export const heroWordVariants = createFadeUp(42, 0.9);
