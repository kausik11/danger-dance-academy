"use client";

import dynamic from "next/dynamic";

const ThreeScene = dynamic(
  () => import("@/components/ThreeScene").then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="glass-panel h-[32rem] animate-pulse rounded-[36px]" />
      </section>
    ),
  },
);

export function HomeThreeScene() {
  return <ThreeScene />;
}
