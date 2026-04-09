import { Heart } from "lucide-react";
import { academyData } from "@/lib/academy";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <div className="space-y-2">
        <p className="text-pretty">
          {academyData.shortName} | {academyData.tagline}
        </p>
        <p className="flex flex-wrap items-center gap-2 text-slate-400/90">
          <span>All rights reserved.</span>
          <span>Design and developed by</span>
          <a
            href="https://www.linkedin.com/in/kausik-saha-fsd"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center rounded-full border border-amber-200/28 bg-[linear-gradient(135deg,rgba(255,248,220,0.2)_0%,rgba(245,158,11,0.16)_45%,rgba(251,191,36,0.22)_100%)] px-3 py-1 font-display text-[0.78rem] uppercase tracking-[0.28em] text-amber-100 shadow-[0_10px_30px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:border-amber-100/40 hover:text-white hover:shadow-[0_14px_34px_rgba(245,158,11,0.26),inset_0_1px_0_rgba(255,255,255,0.26)]"
          >
            kausik
          </a>
          <Heart
            className="h-4 w-4 fill-rose-500 text-rose-400"
            aria-hidden="true"
          />
        </p>
      </div>

      <a
        href={`tel:${academyData.phone}`}
        className="inline-flex min-h-11 items-center self-start text-base text-white/84 transition hover:text-white lg:self-auto"
      >
        {academyData.phone}
      </a>
    </footer>
  );
}
