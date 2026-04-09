"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(
  () => import("@/components/ThreeScene").then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="glass-panel h-[20rem] animate-pulse rounded-[28px] sm:h-[32rem] sm:rounded-[36px]" />
      </section>
    ),
  },
);

export function HomeThreeScene() {
  return <ThreeScene />;
}
