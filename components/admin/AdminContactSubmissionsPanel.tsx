"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckCircle2, Inbox, MessageSquareMore, Phone } from "lucide-react";
import type { ContactSubmission } from "@/lib/contact-submissions";

type AdminContactSubmissionsPanelProps = {
  initialSubmissions: ContactSubmission[];
  embedded?: boolean;
  onSubmissionsChange?: (items: ContactSubmission[]) => void;
};

const surfaceClassName =
  "rounded-[28px] border border-[#d9e5fb] bg-white shadow-[0_18px_50px_rgba(37,99,235,0.08)]";
const mutedEyebrowClassName =
  "text-[11px] uppercase tracking-[0.24em] text-slate-500";
const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#d8e5fb] bg-[#f8fbff] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#93c5fd] focus:bg-white";

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

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

export function AdminContactSubmissionsPanel({
  initialSubmissions,
  embedded = false,
  onSubmissionsChange,
}: AdminContactSubmissionsPanelProps) {
  const [submissions, setSubmissions] =
    useState<ContactSubmission[]>(initialSubmissions);
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

  useEffect(() => {
    onSubmissionsChange?.(submissions);
  }, [onSubmissionsChange, submissions]);

  function syncActiveForm(submission: ContactSubmission | null) {
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
      items?: ContactSubmission[];
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
          item?: ContactSubmission;
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
          ? "grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]"
          : "mt-8 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]"
      }
    >
      <section className={`${surfaceClassName} p-5`}>
        <div className="border-b border-[#e5eefc] pb-4">
          <p className={mutedEyebrowClassName}>Inbox</p>
          <p className="mt-2 font-display text-2xl text-slate-900">
            Website contact requests
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {submissions.length} enquiries available for follow-up.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {submissions.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#d8e5fb] px-4 py-5 text-sm text-slate-500">
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
                className={`w-full rounded-[22px] border px-4 py-4 text-left ${
                  isActive
                    ? "border-[#bfdbfe] bg-[linear-gradient(135deg,rgba(219,234,254,0.9)_0%,rgba(255,255,255,1)_100%)] shadow-[0_12px_24px_rgba(37,99,235,0.08)]"
                    : "border-[#e5eefc] bg-[#f8fbff] hover:border-[#bfdbfe] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {submission.name}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {submission.preferredCenterName}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      {submission.isConnected ? "Connected" : "Pending"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      submission.isConnected
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-[#dbeafe] text-[#2563eb]"
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

      <section className={`${surfaceClassName} p-5 sm:p-6`}>
        <div className="flex flex-col gap-4 border-b border-[#e5eefc] pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className={mutedEyebrowClassName}>Enquiry Detail</p>
            <p className="mt-2 font-display text-3xl text-slate-900">
              {activeSubmission ? activeSubmission.name : "No enquiry selected"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Review the message, update contact status, and add internal notes.
            </p>
          </div>

          {activeSubmission ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Save follow-up"}
            </button>
          ) : null}
        </div>

        {notice ? (
          <p className="mt-4 rounded-[22px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
            {notice}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-[22px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </p>
        ) : null}
        {activeSubmission ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#2563eb]">
                <Inbox className="h-5 w-5" />
                <p className={mutedEyebrowClassName}>Email</p>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {activeSubmission.email}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#2563eb]">
                <Phone className="h-5 w-5" />
                <p className={mutedEyebrowClassName}>Phone</p>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {activeSubmission.phone}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <p className={mutedEyebrowClassName}>Preferred Center</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {activeSubmission.preferredCenterName}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <p className={mutedEyebrowClassName}>Submitted At</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {formatSubmissionTimestamp(activeSubmission.createdAt)}
              </p>
            </div>

            <div className="md:col-span-2 rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <div className="flex items-center gap-3 text-[#2563eb]">
                <MessageSquareMore className="h-5 w-5" />
                <p className={mutedEyebrowClassName}>Message</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {activeSubmission.message}
              </p>
            </div>

            <div className="md:col-span-2 rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isConnected}
                  onChange={(event) => setIsConnected(event.target.checked)}
                  className="h-4 w-4 accent-[#2563eb]"
                />
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-[#2563eb]" />
                  Mark as connected
                </span>
              </label>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                This field is editable only in the admin panel.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block">
                <span className={mutedEyebrowClassName}>Admin Comments</span>
                <textarea
                  value={adminComments}
                  onChange={(event) => setAdminComments(event.target.value)}
                  rows={6}
                  className={inputClassName}
                  placeholder="Add follow-up notes, next action, or call outcome."
                />
              </label>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Internal note only. This is never shown on the public website.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <p className={mutedEyebrowClassName}>User Agent</p>
              <p className="mt-3 break-words text-sm text-slate-600">
                {activeSubmission.userAgent}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              <p className={mutedEyebrowClassName}>IP Address</p>
              <p className="mt-3 text-sm text-slate-600">
                {activeSubmission.ipAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[22px] border border-dashed border-[#d8e5fb] px-4 py-5 text-sm text-slate-500">
            Select a contact submission to review and update follow-up fields.
          </div>
        )}
      </section>
    </section>
  );
}
