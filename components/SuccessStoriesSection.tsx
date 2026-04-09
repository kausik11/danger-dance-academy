import Image from "next/image";
import type { SuccessStoryItem } from "@/lib/academy-cms";

type SuccessStoriesSectionProps = {
  stories: SuccessStoryItem[];
};

export function SuccessStoriesSection({
  stories,
}: SuccessStoriesSectionProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section
      id="stories"
      className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      <div className="max-w-3xl">
        <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Success Stories
        </p>
        <h2 className="mt-4 font-display text-3xl text-white sm:text-5xl">
          Student journeys connected to the success story endpoint.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {stories.map((story) => (
          <article
            key={story.id}
            className="glass-panel grid gap-0 overflow-hidden rounded-[30px] border border-white/10 md:grid-cols-[0.78fr_1.22fr]"
          >
            <div className="relative min-h-72">
              <Image
                src={story.photoUrl}
                alt={story.studentName}
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-display text-2xl text-white sm:text-3xl">
                  {story.studentName}
                </p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                  Joined {story.yearJoined}
                </span>
              </div>
              <p className="mt-4 text-lg text-slate-100">{story.headline}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300/80">
                {story.story}
              </p>
              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-4 text-sm text-cyan-50">
                {story.achievement}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
