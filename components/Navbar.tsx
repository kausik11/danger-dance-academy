"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const showContactButton = pathname !== "/contact";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function renderActionButton() {
    if (ctaHref) {
      if (ctaHref.startsWith("/")) {
        return (
          <Link
            href={ctaHref}
            onClick={closeMenu}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300/70 bg-white px-5 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-300 hover:text-sky-700"
          >
            {ctaLabel ?? "Action"}
          </Link>
        );
      }

      return (
        <a
          href={ctaHref}
          onClick={closeMenu}
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300/70 bg-white px-5 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-300 hover:text-sky-700"
        >
          {ctaLabel ?? "Action"}
        </a>
      );
    }

    if (showContactButton) {
      return (
        <Link
          href="/contact"
          onClick={closeMenu}
          className="inline-flex h-10 items-center justify-center rounded-full border border-sky-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#d8f1ff_46%,#99ddff_100%)] px-5 text-sm font-semibold text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(56,189,248,0.2)]"
        >
          Contact Us
        </Link>
      );
    }

    return (
      <a
        href={`tel:${academyData.phone}`}
        onClick={closeMenu}
        className="inline-flex h-10 items-center justify-center rounded-full border border-sky-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#d8f1ff_46%,#99ddff_100%)] px-5 text-sm font-semibold text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(56,189,248,0.2)]"
      >
        Call Now
      </a>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto max-w-[92rem] px-3 py-4 sm:px-5 lg:px-6">
        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.94)_100%)] shadow-[0_22px_56px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6 xl:gap-8">
            <Link
              href="/"
              onClick={closeMenu}
              className="min-w-0 flex-1 xl:w-[17.5rem] xl:flex-none 2xl:w-[19.5rem]"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)]">
                  <Image
                    src="/logo.jpeg"
                    alt={`${academyData.shortName} logo`}
                    fill
                    sizes="48px"
                    className="object-cover"
                    priority
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-slate-900 sm:text-[1.12rem]">
                    {academyData.shortName}
                  </p>
                  <div className="mt-2 hidden 2xl:flex">
                    <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.92)_100%)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(15,23,42,0.06)]">
                      <span>Baranagar</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70 shadow-[0_0_10px_rgba(56,189,248,0.45)]" />
                      <span>Dunlop</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70 shadow-[0_0_10px_rgba(56,189,248,0.45)]" />
                      <span>Belghoria</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {!ctaHref ? (
              <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex 2xl:gap-6">
                {academyData.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`shrink-0 text-[0.84rem] font-semibold uppercase tracking-[0.06em] transition ${
                      pathname === item.href
                        ? "text-sky-700"
                        : "text-slate-700/90 hover:text-sky-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}

            <div className="hidden items-center gap-3 sm:flex xl:flex-none">
              {renderActionButton()}
            </div>

            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300/70 bg-white text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-300 hover:text-sky-700 xl:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isMenuOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="overflow-hidden xl:hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -8 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="border-t border-slate-200/80 px-4 pb-4 pt-4 sm:px-5 lg:px-6"
                >
                  <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-slate-500 sm:hidden">
                    Baranagar | Dunlop | Belghoria
                  </div>

                  {!ctaHref ? (
                    <nav className="grid gap-2">
                      {academyData.navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{
                            duration: 0.18,
                            ease: "easeOut",
                            delay: index * 0.025,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={`block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                              pathname === item.href
                                ? "bg-sky-100 text-sky-700"
                                : "bg-white/70 text-slate-700 hover:bg-slate-100 hover:text-sky-700"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
                    className="mt-4 sm:hidden"
                  >
                    {renderActionButton()}
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
