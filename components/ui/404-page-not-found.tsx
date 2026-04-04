"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="mesh-overlay pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute left-[-10rem] top-24 h-[28rem] w-[28rem] rounded-full bg-sky-500/14 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-10 h-[24rem] w-[24rem] rounded-full bg-blue-500/14 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-[18%] top-20 h-24 rounded-full bg-white/6 blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="flex justify-center">
          <div className="relative w-full overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,rgba(8,27,49,0.9)_0%,rgba(5,20,37,0.96)_100%)] px-6 py-10 text-center shadow-[0_40px_120px_rgba(2,8,23,0.62)] ring-1 ring-white/6 sm:w-10/12 sm:px-10 sm:py-12 md:w-8/12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
            <p className="text-sm uppercase tracking-[0.32em] text-sky-200/70">
              Page Not Found
            </p>
            <div
              className="relative mt-6 h-[250px] overflow-hidden rounded-[38px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-18px_40px_rgba(2,8,23,0.12),0_30px_80px_rgba(2,8,23,0.38)] backdrop-blur-xl sm:h-[350px] md:h-[400px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_42%)]" />
              <div className="pointer-events-none absolute inset-[1px] rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
              <div
                className="relative h-full rounded-[36px] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
              }}
              aria-hidden="true"
            >
                <h1 className="pt-6 text-center font-display text-6xl text-[#123f87] drop-shadow-[0_12px_30px_rgba(2,8,23,0.45)] sm:pt-8 sm:text-7xl md:text-8xl">
                  404
                </h1>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <h3 className="mb-4 font-display text-3xl text-white drop-shadow-[0_10px_24px_rgba(2,8,23,0.45)] sm:text-4xl">
                Looks like you&apos;re lost
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-base leading-8 text-slate-300/85 sm:mb-5">
                The page you are looking for is not available!
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="default"
                  onClick={() => router.push("/")}
                  className="h-11 rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-6 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.32)] hover:scale-[1.02] hover:bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)]"
                >
                  Go to Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/contact")}
                  className="h-11 rounded-full bg-white/6 px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
