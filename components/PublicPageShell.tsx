import { Navbar } from "@/components/Navbar";
import { HomeClientShell } from "@/components/HomeClientShell";
import { SiteFooter } from "@/components/SiteFooter";

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
      <div className="relative min-h-screen overflow-x-clip">
        <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute left-[-8rem] top-36 h-[22rem] w-[22rem] rounded-full bg-sky-500/14 blur-3xl sm:left-[-10rem] sm:top-44 sm:h-[28rem] sm:w-[28rem]" />
        <div className="pointer-events-none absolute right-[-6rem] top-[24rem] h-[18rem] w-[18rem] rounded-full bg-blue-500/14 blur-3xl sm:right-[-8rem] sm:top-[28rem] sm:h-[24rem] sm:w-[24rem]" />

        <Navbar />

        <main className="relative z-10">
          <section className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-10">
            <div className="glass-panel rounded-[28px] px-5 py-8 sm:rounded-[34px] sm:px-8 sm:py-12">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-3xl text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300/85 sm:text-base sm:leading-8">
                {description}
              </p>
            </div>
          </section>

          {children}
        </main>

        <SiteFooter />
      </div>
    </HomeClientShell>
  );
}
