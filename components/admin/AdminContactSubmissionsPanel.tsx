"use client";

import { useMemo, useState, useTransition } from "react";

type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  preferredCenterName: string;
  message: string;
  status: "new";
  source: "website-contact-form";
  isConnected: boolean;
  adminComments: string;
  createdAt: string;
  updatedAt: string;
  userAgent: string;
  ipAddress: string;
};

type AdminContactSubmissionsPanelProps = {
  initialSubmissions: ContactSubmissionRecord[];
  embedded?: boolean;
};

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function formatSubmissionTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getUTCFullYear();
  const month = padDatePart(date.getUTCMonth() + 1);
  const day = padDatePart(date.getUTCDate());
  const hours = padDatePart(date.getUTCHours());
  const minutes = padDatePart(date.getUTCMinutes());
  const seconds = padDatePart(date.getUTCSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

export function AdminContactSubmissionsPanel({
  initialSubmissions,
  embedded = false,
}: AdminContactSubmissionsPanelProps) {
  const [submissions, setSubmissions] =
    useState<ContactSubmissionRecord[]>(initialSubmissions);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    initialSubmissions[0]?.id ?? null,
  );
  const [isConnected, setIsConnected] = useState(
    initialSubmissions[0]?.isConnected ?? false,
  );
  const [adminComments, setAdminComments] = useState(
    initialSubmissions[0]?.adminComments ?? "",
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeSubmission = useMemo(
    () =>
      submissions.find((submission) => submission.id === selectedSubmissionId) ??
      null,
    [submissions, selectedSubmissionId],
  );

  function syncActiveForm(submission: ContactSubmissionRecord | null) {
    setIsConnected(submission?.isConnected ?? false);
    setAdminComments(submission?.adminComments ?? "");
  }

  function handleSelectSubmission(submissionId: string) {
    const submission =
      submissions.find((entry) => entry.id === submissionId) ?? null;

    setSelectedSubmissionId(submissionId);
    syncActiveForm(submission);
    setNotice(null);
    setError(null);
  }

  async function refreshSubmissions(preferredId?: string | null) {
    const response = await fetch("/api/admin/contact-submissions", {
      cache: "no-store",
    });

    const data = (await response.json()) as {
      error?: string;
      items?: ContactSubmissionRecord[];
    };

    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }

    if (!response.ok || !data.items) {
      throw new Error(data.error ?? "Unable to refresh contact submissions.");
    }

    const nextSelectedId =
      (preferredId && data.items.some((item) => item.id === preferredId)
        ? preferredId
        : data.items[0]?.id) ?? null;
    const nextActive =
      data.items.find((item) => item.id === nextSelectedId) ?? null;

    setSubmissions(data.items);
    setSelectedSubmissionId(nextSelectedId);
    syncActiveForm(nextActive);
  }

  function handleSave() {
    if (!activeSubmission) {
      return;
    }

    setNotice(null);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/admin/contact-submissions/${activeSubmission.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isConnected,
              adminComments,
            }),
          },
        );

        const data = (await response.json()) as {
          error?: string;
          item?: ContactSubmissionRecord;
        };

        if (response.status === 401) {
          window.location.assign("/admin/login");
          return;
        }

        if (!response.ok || !data.item) {
          throw new Error(data.error ?? "Unable to update contact submission.");
        }

        await refreshSubmissions(data.item.id);
        setNotice("Contact submission updated successfully.");
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Unable to update contact submission.",
        );
      }
    });
  }

  return (
    <section
      className={
        embedded
          ? "grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]"
          : "glass-panel mt-8 rounded-[34px] p-6 sm:p-8"
      }
    >
      <div
        className={`flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between ${
          embedded ? "xl:col-span-2" : ""
        }`}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
            Contact Submissions
          </p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
            Review enquiries and update admin follow-up state.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/80">
            Public users can only create enquiries. `isConnected` and
            `adminComments` are editable here in the protected admin panel.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200">
          {submissions.length} enquiries
        </div>
      </div>

      <div className={embedded ? "contents" : "mt-6 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]"}>
        <section className="rounded-[30px] border border-white/10 bg-black/20 p-4">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Inbox
            </p>
            <p className="mt-2 font-display text-xl text-white">
              Website Contact Requests
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/12 px-4 py-5 text-sm text-slate-400">
                No contact enquiries yet.
              </div>
            ) : null}

            {submissions.map((submission) => {
              const isActive = submission.id === selectedSubmissionId;

              return (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => handleSelectSubmission(submission.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left ${
                    isActive
                      ? "border-cyan-300/35 bg-cyan-300/10"
                      : "border-white/10 bg-slate-950/55 hover:border-cyan-300/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {submission.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {submission.preferredCenterName}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        {submission.isConnected ? "Connected" : "Pending"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${
                        submission.isConnected
                          ? "border border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                          : "border border-amber-300/25 bg-amber-300/10 text-amber-100"
                      }`}
                    >
                      {submission.isConnected ? "Done" : "Open"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatSubmissionTimestamp(submission.createdAt)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-black/20 p-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Enquiry Detail
              </p>
              <p className="mt-2 font-display text-2xl text-white">
                {activeSubmission ? activeSubmission.name : "No enquiry selected"}
              </p>
            </div>
            {activeSubmission ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.32)] disabled:opacity-70"
              >
                {isPending ? "Saving..." : "Save Follow-Up"}
              </button>
            ) : null}
          </div>

          {notice ? (
            <p className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {notice}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          {activeSubmission ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-sm text-white">{activeSubmission.email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Phone
                </p>
                <p className="mt-2 text-sm text-white">{activeSubmission.phone}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Preferred Center
                </p>
                <p className="mt-2 text-sm text-white">
                  {activeSubmission.preferredCenterName}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Submitted At
                </p>
                <p className="mt-2 text-sm text-white">
                  {formatSubmissionTimestamp(activeSubmission.createdAt)}
                </p>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Message
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {activeSubmission.message}
                </p>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isConnected}
                    onChange={(event) => setIsConnected(event.target.checked)}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  <span className="text-sm font-medium text-slate-100">
                    Is Connected
                  </span>
                </label>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This field can only be changed by an authenticated admin.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Admin Comments
                  </span>
                  <textarea
                    value={adminComments}
                    onChange={(event) => setAdminComments(event.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                    placeholder="Add follow-up notes, call outcome, or next action."
                  />
                </label>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This note stays internal to the admin panel and is not
                  writable from the public contact form.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  User Agent
                </p>
                <p className="mt-2 break-words text-sm text-slate-300">
                  {activeSubmission.userAgent}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  IP Address
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {activeSubmission.ipAddress}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-sm text-slate-400">
              Select a contact submission to review and update admin follow-up
              fields.
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
