import type { FaqItem } from "@/lib/academy-cms";

type FaqSectionProps = {
  faqs: FaqItem[];
};

export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faqs" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
          FAQs
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Answers now loaded from your FAQ endpoint.
        </h2>
      </div>

      <div className="mt-10 grid gap-4">
        {faqs.map((faq) => (
          <article
            key={faq.id}
            className="glass-panel rounded-[28px] border border-white/10 p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-display text-2xl text-white">
                  {faq.question}
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300/80">
                  {faq.answer}
                </p>
              </div>
              <span className="glass-pill rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                {faq.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
