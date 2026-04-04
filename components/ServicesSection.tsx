import Image from "next/image";
import type { ServiceItem } from "@/lib/academy-cms";

type ServicesSectionProps = {
  services: ServiceItem[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Services
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Backend-managed academy programs now live on the homepage.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            className="glass-panel overflow-hidden rounded-[30px] border border-white/10"
          >
            <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-64">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-2xl text-white">
                    {service.title}
                  </p>
                  {service.featured ? (
                    <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-50">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300/80">
                  {service.summary}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {service.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200">
                    {service.ageGroup}
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200">
                    {service.priceLabel}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
