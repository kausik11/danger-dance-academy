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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
            Events
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            Upcoming academy showcases and workshops from your API.
          </h2>
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
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                {event.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Date
                </p>
                <p className="mt-3 text-sm text-white">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
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
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950"
              >
                Register Event
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
