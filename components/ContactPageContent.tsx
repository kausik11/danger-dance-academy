"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { academyData } from "@/lib/academy";

type ContactCenter = (typeof academyData.contactCenters)[number];

type ContactPageContentProps = {
  centers: readonly ContactCenter[];
  academyEmail: string;
  academyPhone: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  message: string;
};

const defaultSubmissionMessage =
  "Tell us about the student age group, dance interest, and preferred class timing.";

export function ContactPageContent({
  centers,
  academyEmail,
  academyPhone,
}: ContactPageContentProps) {
  const [activeCenterId, setActiveCenterId] = useState<string>(
    centers[0]?.id ?? "",
  );
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    preferredCenterId: centers[0]?.id ?? "",
    message: defaultSubmissionMessage,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const activeCenter = useMemo(
    () =>
      centers.find((center) => center.id === activeCenterId) ?? centers[0] ?? null,
    [activeCenterId, centers],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCenterSelect(center: ContactCenter) {
    setActiveCenterId(center.id);
    setForm((current) => ({ ...current, preferredCenterId: center.id }));
    setFeedback(null);
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
          "Your enquiry has been submitted. The academy will contact you soon.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        preferredCenterId: activeCenter?.id ?? centers[0]?.id ?? "",
        message: defaultSubmissionMessage,
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

  if (!activeCenter) {
    return null;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-8 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {centers.map((center) => (
            <article
              key={center.id}
              className="glass-panel rounded-[30px] border border-white/10 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            >
              <p className="font-display text-2xl text-white">{center.name}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300/82">
                {center.address}
              </p>
              <p className="mt-4 text-sm font-semibold text-sky-200">
                {center.hours}
              </p>
              <a
                href={`tel:${center.phone.replace(/\s+/g, "")}`}
                className="mt-4 inline-flex text-sm text-slate-200 transition hover:text-white"
              >
                Call: {center.phone}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="glass-panel h-full rounded-[34px] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
              Get In Touch
            </p>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
              Pick a center and open the location instantly.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300/84">
              Use the center list to switch the embedded map. This follows the
              same clinic-style interaction pattern from your reference while
              keeping the academy branding and layout.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${academyPhone}`}
                className="rounded-[28px] border border-white/10 bg-black/20 p-5 transition hover:border-sky-300/40 hover:bg-black/28"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/14 text-sky-100">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Call Us</p>
                    <p className="mt-1 text-sm text-slate-300">{academyPhone}</p>
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${academyEmail}`}
                className="rounded-[28px] border border-white/10 bg-black/20 p-5 transition hover:border-sky-300/40 hover:bg-black/28"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/14 text-sky-100">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Email</p>
                    <p className="mt-1 text-sm text-slate-300">{academyEmail}</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="mt-10 space-y-4">
              {centers.map((center) => {
                const isActive = center.id === activeCenter.id;

                return (
                  <button
                    key={center.id}
                    type="button"
                    onClick={() => handleCenterSelect(center)}
                    className={`w-full rounded-[28px] border p-5 text-left transition ${
                      isActive
                        ? "border-sky-300/45 bg-sky-400/10 shadow-[0_0_0_1px_rgba(125,211,252,0.25)]"
                        : "border-white/10 bg-black/16 hover:border-white/20 hover:bg-black/24"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="font-display text-2xl text-white">
                          {center.name}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">{center.area}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          {center.address}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <Phone className="h-4 w-4 text-sky-200" />
                            {center.phone}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4 text-sky-200" />
                            {center.email}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full border border-white/10 bg-black/20 p-3 text-sky-100">
                        <MapPin className="h-5 w-5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-panel flex h-full flex-col rounded-[34px] p-4 sm:p-5">
            <div className="min-h-[420px] flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-white">
              <iframe
                key={activeCenter.id}
                title={`${activeCenter.name} map`}
                src={activeCenter.mapEmbedUrl}
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <p className="font-display text-2xl text-white">
                {activeCenter.name}
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="inline-flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                  <span>{activeCenter.address}</span>
                </p>
                <p className="inline-flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-sky-200" />
                  <span>{activeCenter.hours}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={activeCenter.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.28)]"
                >
                  Open In Google Maps
                </a>
                <a
                  href={`tel:${activeCenter.phone.replace(/\s+/g, "")}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-black/20 px-5 text-sm font-semibold text-white"
                >
                  Call This Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="glass-panel rounded-[34px] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
              Contact Form
            </p>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
              Send an enquiry to the academy.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300/84">
              Use this form for trial classes, fee questions, class timings,
              events, and admission queries. Every submission is stored in
              MongoDB through your new `POST /api/contact` endpoint.
            </p>

            <div className="mt-8 space-y-5 text-sm text-slate-300">
              <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                <p className="font-semibold text-white">Selected Center</p>
                <p className="mt-2 text-slate-300">{activeCenter.name}</p>
                <p className="mt-2 text-slate-400">{activeCenter.address}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                <p className="font-semibold text-white">What to include</p>
                <p className="mt-2 leading-7 text-slate-400">
                  Mention the student age group, preferred branch, dance style,
                  and best callback timing so the team can respond properly.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-[34px] p-6 sm:p-8"
          >
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
                  onChange={(event) => {
                    updateField("preferredCenterId", event.target.value);
                    setActiveCenterId(event.target.value);
                  }}
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-sky-300/40"
                  required
                >
                  {centers.map((center) => (
                    <option key={center.id} value={center.id} className="bg-slate-950">
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
                rows={7}
                placeholder="Tell us what kind of class or help you need."
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
                Your submission will be saved in MongoDB for admin follow-up.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
