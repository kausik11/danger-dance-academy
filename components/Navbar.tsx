"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Menu, Phone, Send, X } from "lucide-react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { academyData } from "@/lib/academy";

type NavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  message: string;
};

const defaultContactMessage =
  "Hi, I want to know more about classes, fees, timings, and trial options.";
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
});

export function Navbar({ ctaHref, ctaLabel }: NavbarProps) {
  const pathname = usePathname();
  const showContactButton = pathname !== "/contact";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    preferredCenterId: academyData.contactCenters[0]?.id ?? "",
    message: defaultContactMessage,
  });

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
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isContactModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeContactModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContactModalOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openContactModal() {
    closeMenu();
    setFeedback(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      preferredCenterId: academyData.contactCenters[0]?.id ?? "",
      message: defaultContactMessage,
    });
    setIsContactModalOpen(true);
  }

  function closeContactModal() {
    setIsContactModalOpen(false);
    setFeedback(null);
    setIsSubmitting(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to submit the contact form.");
      }

      setFeedback({
        type: "success",
        message:
          data.message ??
          "Your enquiry has been sent. The academy team will contact you shortly.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        preferredCenterId: academyData.contactCenters[0]?.id ?? "",
        message: defaultContactMessage,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit the contact form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const brandTextClass = isScrolled
    ? "text-[#d7efff] drop-shadow-[0_0_24px_rgba(96,165,250,0.3)] [text-shadow:0_0_20px_rgba(159,211,255,0.18)] [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]"
    : "text-[#d7efff] drop-shadow-[0_0_28px_rgba(96,165,250,0.34)] [text-shadow:0_0_24px_rgba(159,211,255,0.2)] [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]";
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
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-300/70 bg-white px-5 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-300 hover:text-sky-700 sm:w-auto"
          >
            {ctaLabel ?? "Action"}
          </Link>
        );
      }

      return (
        <a
          href={ctaHref}
          onClick={closeMenu}
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-300/70 bg-white px-5 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-300 hover:text-sky-700 sm:w-auto"
        >
          {ctaLabel ?? "Action"}
        </a>
      );
    }

    if (showContactButton) {
      return (
        <button
          type="button"
          onClick={openContactModal}
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-sky-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#d8f1ff_46%,#99ddff_100%)] px-5 text-sm font-semibold text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(56,189,248,0.2)] sm:w-auto"
        >
          Contact Us
        </button>
      );
    }

    return (
      <a
        href={`tel:${academyData.phone}`}
        onClick={closeMenu}
        className="inline-flex h-11 w-full items-center justify-center rounded-full border border-sky-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#d8f1ff_46%,#99ddff_100%)] px-5 text-sm font-semibold text-slate-900 shadow-[0_12px_26px_rgba(56,189,248,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(56,189,248,0.2)] sm:w-auto"
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
      <div className="mx-auto max-w-[92rem] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
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
                    "linear-gradient(180deg, rgba(7, 16, 33, 0.58) 0%, rgba(10, 24, 46, 0.4) 100%)",
                  borderColor: "rgba(186, 230, 253, 0.18)",
                  boxShadow:
                    "0 20px 52px rgba(2, 8, 23, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
                }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative isolate overflow-hidden rounded-[24px] border backdrop-blur-xl sm:rounded-[28px]"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden">
            <Image
              src="/all-gif/fire.gif"
              alt=""
              aria-hidden="true"
              width={1600}
              height={220}
              unoptimized
              className="h-16 w-full object-cover object-bottom opacity-28 sm:h-20"
              style={{
                WebkitMaskImage:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 30%, rgba(0,0,0,0.96) 100%)",
                maskImage:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 30%, rgba(0,0,0,0.96) 100%)",
                filter: "saturate(0.92) contrast(0.96) brightness(0.82)",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.04)_0%,rgba(3,7,18,0.24)_42%,rgba(3,7,18,0.68)_100%)]" />
          </div>

          <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04)_0%,rgba(2,6,23,0.08)_54%,rgba(2,6,23,0.18)_100%)]" />

          <div className="relative z-10 flex items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-5 lg:px-6 xl:gap-8">
            <Link
              href="/"
              onClick={closeMenu}
              className="min-w-0 flex-1 xl:w-[20rem] xl:flex-none 2xl:w-[22rem]"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] border border-slate-200 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.1)] sm:h-16 sm:w-16 sm:rounded-[1.35rem]">
                  <Image
                    src="/logo.jpeg"
                    alt={`${academyData.shortName} logo`}
                    fill
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-cover"
                    priority
                  />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <p
                      className={`text-[0.95rem] font-semibold leading-[1.05] tracking-normal whitespace-normal sm:text-[1.12rem] ${playfairDisplay.className} ${brandTextClass}`}
                    >
                      {academyData.shortName}
                    </p>
                    <Image
                      src="/all-gif/littlebird1.gif"
                      alt=""
                      aria-hidden="true"
                      width={52}
                      height={52}
                      unoptimized
                      className="h-9 w-9 shrink-0 object-contain sm:h-[3rem] sm:w-[3rem]"
                    />
                  </div>
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
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition xl:hidden ${menuButtonClass}`}
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
                className="relative z-10 overflow-hidden xl:hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -8 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="border-t border-white/12 px-3 pb-4 pt-4 sm:px-5 lg:px-6"
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
                            className={`block min-h-11 rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.01em] transition ${
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

      <AnimatePresence>
        {isContactModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto px-4 py-4 sm:items-center sm:px-6 sm:py-6"
          >
            <button
              type="button"
              aria-label="Close contact form"
              className="absolute inset-0 bg-slate-950/78 backdrop-blur-sm"
              onClick={closeContactModal}
            />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="glass-panel relative z-10 my-auto flex max-h-[calc(100svh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/12 sm:max-h-[calc(100svh-3rem)] sm:rounded-[34px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,242,254,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_28%),linear-gradient(180deg,rgba(6,23,44,0.14)_0%,rgba(4,14,28,0.08)_100%)]" />

              <button
                type="button"
                aria-label="Close modal"
                onClick={closeContactModal}
                className="glass-card absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-200 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-xl pr-12 sm:pr-16">
                  <h3 className="font-display text-2xl leading-tight text-white sm:text-4xl">
                    Ask about classes, fees, and trial options
                  </h3>
                  <a
                    href={`tel:${academyData.phone}`}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
                  >
                    <Phone className="h-4 w-4 text-sky-200" />
                    {academyData.phone}
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 sm:mt-5">
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-200">Full Name</span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Student or parent name"
                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-200">Phone</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-200">Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="name@example.com"
                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-slate-200">
                        Preferred Center
                      </span>
                      <select
                        value={form.preferredCenterId}
                        onChange={(event) =>
                          updateField("preferredCenterId", event.target.value)
                        }
                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-sky-300/40"
                        required
                      >
                        {academyData.contactCenters.map((center) => (
                          <option
                            key={center.id}
                            value={center.id}
                            className="bg-slate-950"
                          >
                            {center.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block sm:mt-5">
                    <span className="text-sm font-medium text-slate-200">Message</span>
                    <textarea
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      rows={5}
                      placeholder="Tell us which class or support you need."
                      className="mt-2 w-full rounded-[28px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40"
                      required
                    />
                  </label>

                  {feedback ? (
                    <div
                      className={`mt-5 rounded-[24px] border px-4 py-3 text-sm ${
                        feedback.type === "success"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                          : "border-rose-400/30 bg-rose-400/10 text-rose-100"
                      }`}
                    >
                      {feedback.type === "success" ? (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          {feedback.message}
                        </span>
                      ) : (
                        feedback.message
                      )}
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-4 sm:mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-6 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.3)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Sending..." : "Send Enquiry"}
                      </span>
                    </button>
                    <p className="text-sm text-slate-400">
                      The team will contact you shortly with batch and fee details.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
