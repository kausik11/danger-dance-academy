"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, Send, Sparkles, X } from "lucide-react";
import { academyData } from "@/lib/academy";
import type { ServiceItem } from "@/lib/academy-cms";

type ServicesSectionProps = {
  services: ServiceItem[];
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  message: string;
};

const defaultInquiryMessage =
  "Hi, I want to know more about the classes, fees, timings, and trial options.";

function buildServiceMessage(serviceTitle: string) {
  return `Hi, I want to know more about the ${serviceTitle} classes, fees, timings, and trial options.`;
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
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
    message: defaultInquiryMessage,
  });

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedService(null);
        setFeedback(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedService]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openContactModal(service: ServiceItem) {
    setSelectedService(service);
    setFeedback(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      preferredCenterId: academyData.contactCenters[0]?.id ?? "",
      message: buildServiceMessage(service.title),
    });
  }

  function closeContactModal() {
    setSelectedService(null);
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
        message: selectedService
          ? buildServiceMessage(selectedService.title)
          : defaultInquiryMessage,
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

  if (services.length === 0) {
    return null;
  }

  return (
    <>
      <section id="services" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
            Services
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            Explore hip hop, ballet, modern, and freestyle dance forms for every stage.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="glass-panel overflow-hidden rounded-[30px] border border-white/10"
            >
              <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
                <div className="relative min-h-64">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-2xl text-white">
                      {service.title}
                    </p>
                    {service.featured ? (
                      <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-50">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300/80">
                    {service.summary}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="glass-pill rounded-full px-4 py-2 text-sm text-slate-200">
                      {service.ageGroup}
                    </div>
                    <div className="glass-pill rounded-full px-4 py-2 text-sm text-slate-200">
                      {service.priceLabel}
                    </div>
                    <button
                      type="button"
                      onClick={() => openContactModal(service)}
                      className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-cyan-200/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(186,230,253,0.16)_24%,rgba(96,165,250,0.28)_58%,rgba(34,211,238,0.18)_100%)] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(56,189,248,0.24),inset_0_1px_0_rgba(255,255,255,0.36)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/40 hover:shadow-[0_20px_44px_rgba(56,189,248,0.32),inset_0_1px_0_rgba(255,255,255,0.42)]"
                    >
                      <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.03)_36%,rgba(7,19,34,0.14)_100%)]" />
                      <span className="pointer-events-none absolute -left-10 top-0 h-full w-16 rotate-12 bg-white/18 blur-md transition duration-500 group-hover:left-[calc(100%+1rem)]" />
                      <span className="relative inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-cyan-100" />
                        Contact Us
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedService ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6">
          <button
            type="button"
            aria-label="Close contact form"
            className="absolute inset-0 bg-slate-950/74 backdrop-blur-sm"
            onClick={closeContactModal}
          />

          <div className="glass-panel relative z-10 w-full max-w-2xl overflow-hidden rounded-[34px] border border-white/12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,242,254,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_28%),linear-gradient(180deg,rgba(6,23,44,0.14)_0%,rgba(4,14,28,0.08)_100%)]" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="glass-pill inline-flex rounded-full px-4 py-2 text-sm text-cyan-100">
                    {selectedService.title}
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                    Contact us for this dance form
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-300/82">
                    Ask about fees, trial classes, batch timings, and the best
                    center for this program.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={closeContactModal}
                  className="glass-card inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-200 transition hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="grid gap-5 sm:grid-cols-2">
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

                <label className="mt-5 block">
                  <span className="text-sm font-medium text-slate-200">Message</span>
                  <textarea
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    rows={6}
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

                <div className="mt-6 flex flex-wrap items-center gap-4">
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
          </div>
        </div>
      ) : null}
    </>
  );
}
