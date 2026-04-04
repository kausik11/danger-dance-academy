import { CTASection } from "@/components/CTASection";
import { PublicPageShell } from "@/components/PublicPageShell";
import { academyData } from "@/lib/academy";

export default function JoinPage() {
  return (
    <PublicPageShell
      eyebrow="Join"
      title="Make the next step simple for parents and students."
      description="This route gives your academy a focused conversion page instead of relying only on a bottom-of-page call-to-action."
    >
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Call
            </p>
            <a
              href={`tel:${academyData.phone}`}
              className="mt-4 block font-display text-3xl text-white"
            >
              {academyData.phone}
            </a>
            <p className="mt-4 text-sm leading-7 text-slate-300/80">
              Speak directly to the academy for batch details, trial classes,
              timings, and admission questions.
            </p>
          </article>

          <article className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Trainer
            </p>
            <p className="mt-4 font-display text-3xl text-white">
              {academyData.trainer}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300/80">
              Learn under a performance-focused mentor with attention to rhythm,
              expression, basics, and stage confidence.
            </p>
          </article>

          <article className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Academy
            </p>
            <p className="mt-4 font-display text-3xl text-white">
              {academyData.shortName}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300/80">
              Built for beginners, children, and performance-minded students in
              Baranagar, Dunlop, and Belghoria.
            </p>
          </article>
        </div>
      </section>

      <CTASection />
    </PublicPageShell>
  );
}
