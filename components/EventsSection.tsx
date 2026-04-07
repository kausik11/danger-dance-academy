import Image from "next/image";
import type { EventItem } from "@/lib/academy-cms";

type EventsSectionProps = {
  events: EventItem[];
};

export function EventsSection({ events }: EventsSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-start lg:gap-3">
        <div className="max-w-3xl lg:max-w-[46rem]">
          <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
            Events
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            Upcoming academy showcases and workshops from your API.
          </h2>
        </div>
        <div className="pointer-events-none w-full max-w-[8.5rem] self-start lg:max-w-[10rem] lg:self-center">
          <Image
            src="/all-gif/animation_spider.gif"
            alt=""
            aria-hidden="true"
            width={480}
            height={480}
            unoptimized
            className="h-auto w-full object-contain opacity-90 mix-blend-screen"
            style={{
              filter:
                "drop-shadow(0 14px 34px rgba(56,189,248,0.14)) saturate(1.06)",
            }}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {events.map((event) => (
          <article
            key={event.id}
            className="glass-panel rounded-[30px] border border-white/10 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-white">
                  {event.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300/80">
                  {event.summary}
                </p>
              </div>
              <span className="glass-pill rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                {event.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Date
                </p>
                <p className="mt-3 text-sm text-white">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Location
                </p>
                <p className="mt-3 text-sm text-white">{event.location}</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              {event.description}
            </p>

            {event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-amber-200/40 bg-[linear-gradient(135deg,#fff7d6_0%,#f5d67a_24%,#d8a73c_58%,#fff1b8_100%)] px-6 text-sm font-semibold tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(245,158,11,0.26),inset_0_1px_0_rgba(255,255,255,0.68)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(245,158,11,0.32),inset_0_1px_0_rgba(255,255,255,0.76)]"
              >
                Call To Know More
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
