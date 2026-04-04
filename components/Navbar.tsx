"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { academyData } from "@/lib/academy";

type NavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function Navbar({ ctaHref, ctaLabel }: NavbarProps) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="glass-panel flex w-full items-center justify-between rounded-full px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/40 shadow-[0_0_28px_rgba(56,189,248,0.22)] ring-1 ring-white/10">
              <Image
                src="/logo.jpeg"
                alt={`${academyData.shortName} logo`}
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </span>
            <div>
              <p className="font-display text-base text-white sm:text-lg">
                {academyData.shortName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
                Baranagar
              </p>
            </div>
          </Link>

          {!ctaHref ? (
            <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
              {academyData.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-[0.18em] xl:text-sm xl:tracking-[0.1em] ${
                    pathname === item.href
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          {(ctaHref ?? `tel:${academyData.phone}`).startsWith("/") ? (
            <Link
              href={ctaHref ?? "/join"}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.32)] hover:scale-[1.02]"
            >
              {ctaLabel ?? "Call Now"}
            </Link>
          ) : (
            <a
              href={ctaHref ?? `tel:${academyData.phone}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.32)] hover:scale-[1.02]"
            >
              {ctaLabel ?? "Call Now"}
            </a>
          )}
        </div>
      </div>
    </motion.header>
  );
}
