"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const brandTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 18);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const textElement = brandTextRef.current;

    if (!textElement) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const settings = isScrolled
      ? {
          a: 1.18,
          k: 0.26,
          w: 30,
          wind: 0.14,
          diffusion: 1.3,
          flames: [
            { x: 0, hsla: [54, 100, 92, 0.9], y: 0.04, blur: 0.04 },
            { x: 0, hsla: [43, 100, 72, 0.82], y: 0.14, blur: 0.08 },
            { x: 0, hsla: [29, 98, 61, 0.7], y: 0.28, blur: 0.12 },
            { x: 0, hsla: [17, 94, 50, 0.54], y: 0.42, blur: 0.18 },
            { x: 0, hsla: [8, 88, 44, 0.36], y: 0.58, blur: 0.24 },
          ],
        }
      : {
          a: 1.02,
          k: 0.22,
          w: 27,
          wind: 0.1,
          diffusion: 1.22,
          flames: [
            { x: 0, hsla: [56, 100, 94, 0.76], y: 0.04, blur: 0.03 },
            { x: 0, hsla: [44, 100, 78, 0.64], y: 0.12, blur: 0.06 },
            { x: 0, hsla: [31, 98, 67, 0.52], y: 0.22, blur: 0.1 },
            { x: 0, hsla: [18, 92, 55, 0.4], y: 0.34, blur: 0.15 },
            { x: 0, hsla: [8, 84, 46, 0.24], y: 0.48, blur: 0.2 },
          ],
        };

    async function initBurn() {
      const jqueryModule = await import("jquery");
      const $ = jqueryModule.default;

      if (disposed) {
        return;
      }

      const win = window as typeof window & {
        jQuery?: typeof $;
        $?: typeof $;
      };
      win.jQuery = $;
      win.$ = $;

      if (!($.fn as typeof $.fn & { burn?: unknown }).burn) {
        await new Promise<void>((resolve, reject) => {
          $.getScript("/vendor/jquery.burn.js")
            .done(() => resolve())
            .fail(() => reject(new Error("Failed to load jquery.burn.js")));
        });
      }

      if (disposed) {
        return;
      }

      const burn = ($.fn as typeof $.fn & { burn?: (option?: unknown, settings?: unknown) => unknown })
        .burn;

      if (!burn) {
        return;
      }

      const $text = $(textElement) as JQuery<HTMLElement> & {
        burn: (option?: unknown, settings?: unknown) => unknown;
      };

      $text.burn(false);
      $text.burn(settings);
      cleanup = () => {
        $text.burn(false);
      };
    }

    void initBurn();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [isScrolled]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const brandTextClass = isScrolled
    ? "text-white drop-shadow-[0_2px_16px_rgba(15,23,42,0.42)]"
    : "text-white/96 drop-shadow-[0_2px_14px_rgba(15,23,42,0.42)]";
  const locationPillClass = isScrolled
    ? "border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_100%)] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_rgba(2,8,23,0.18)]"
    : "border-white/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.24)_0%,rgba(15,23,42,0.12)_100%)] text-white/84 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(2,8,23,0.18)]";
  const navLinkBaseClass =
    "shrink-0 text-[0.96rem] font-semibold tracking-[0.01em] transition";
  const navLinkInactiveClass = isScrolled
    ? "text-white/78 hover:text-cyan-100"
    : "text-white/82 hover:text-sky-100";
  const navLinkActiveClass = isScrolled
    ? "text-sky-200"
    : "text-cyan-100";
  const menuButtonClass = isScrolled
    ? "border-white/18 bg-white/10 text-white shadow-[0_10px_24px_rgba(2,8,23,0.2)] hover:border-cyan-200/35 hover:text-cyan-100"
    : "border-white/22 bg-slate-950/14 text-white shadow-[0_10px_24px_rgba(2,8,23,0.16)] hover:border-cyan-200/35 hover:text-cyan-100";

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
        <motion.div
          animate={
            isScrolled
              ? {
                  background:
                    "linear-gradient(135deg, rgba(8, 15, 34, 0.78) 0%, rgba(18, 58, 94, 0.7) 30%, rgba(34, 104, 163, 0.52) 68%, rgba(15, 23, 42, 0.78) 100%)",
                  borderColor: "rgba(186, 230, 253, 0.2)",
                  boxShadow:
                    "0 28px 72px rgba(2, 8, 23, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -18px 36px rgba(14, 165, 233, 0.1)",
                }
              : {
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%)",
                  borderColor: "rgba(255, 255, 255, 0.34)",
                  boxShadow:
                    "0 20px 52px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.32)",
                }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-[28px] border backdrop-blur-xl"
        >
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
                  <p
                    ref={brandTextRef}
                    className={`truncate font-display text-base sm:text-[1.12rem] ${brandTextClass}`}
                  >
                    {academyData.shortName}
                  </p>
                  <div className="mt-2 hidden 2xl:flex">
                    <div
                      className={`inline-flex items-center gap-3 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] ${locationPillClass}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70 shadow-[0_0_10px_rgba(56,189,248,0.45)]" />
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
                    className={`${navLinkBaseClass} ${
                      pathname === item.href
                        ? navLinkActiveClass
                        : navLinkInactiveClass
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
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition xl:hidden ${menuButtonClass}`}
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
                  className="border-t border-white/12 px-4 pb-4 pt-4 sm:px-5 lg:px-6"
                >
                  <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-white/62 sm:hidden">
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
                            className={`block rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.01em] transition ${
                              pathname === item.href
                                ? "bg-cyan-300/18 text-cyan-100"
                                : "bg-white/8 text-white/82 hover:bg-white/14 hover:text-cyan-100"
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
        </motion.div>
      </div>
    </motion.header>
  );
}
