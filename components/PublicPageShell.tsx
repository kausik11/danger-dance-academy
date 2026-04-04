import { Navbar } from "@/components/Navbar";
import { HomeClientShell } from "@/components/HomeClientShell";
import { academyData } from "@/lib/academy";

type PublicPageShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function PublicPageShell({
  children,
  eyebrow,
  title,
  description,
}: PublicPageShellProps) {
  return (
    <HomeClientShell>
      <div className="relative min-h-screen overflow-hidden">
        <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute left-[-10rem] top-44 h-[28rem] w-[28rem] rounded-full bg-sky-500/14 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-[28rem] h-[24rem] w-[24rem] rounded-full bg-blue-500/14 blur-3xl" />

        <Navbar />

        <main className="relative z-10">
          <section className="mx-auto max-w-7xl px-6 pb-10 pt-34 sm:px-8 lg:px-10">
            <div className="glass-panel rounded-[34px] px-6 py-10 sm:px-8 sm:py-12">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/85">
                {description}
              </p>
            </div>
          </section>

          {children}
        </main>

        <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>
            {academyData.shortName} | {academyData.tagline}
          </p>
          <a href={`tel:${academyData.phone}`} className="hover:text-white">
            {academyData.phone}
          </a>
        </footer>
      </div>
    </HomeClientShell>
  );
}
