"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { AdminContactSubmissionsPanel } from "@/components/admin/AdminContactSubmissionsPanel";
import {
  academyAdminDefaults,
  academyAdminFields,
  academyAdminIdentityField,
  academyAdminUploadFolder,
  type AcademyAdminField,
  type AcademyAdminFormState,
  type AcademyAdminFormValue,
} from "@/lib/academy-admin-config";
import {
  academyModuleRegistry,
  type AcademyCollectionSlug,
  type AcademyContentData,
} from "@/lib/academy-cms";
import type { ContactSubmission } from "@/lib/contact-submissions";

type AdminConsoleProps = {
  admin: {
    email: string;
    name: string;
  };
  initialContent: AcademyContentData;
  initialContactSubmissions: ContactSubmission[];
};

type AdminRecord = Record<string, unknown> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
};

type AdminRecordsByModule = Record<AcademyCollectionSlug, AdminRecord[]>;
type AdminSectionSlug = AcademyCollectionSlug | "contact-submissions";

function formatStableDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mapContentToModules(content: AcademyContentData): AdminRecordsByModule {
  return {
    services: content.services,
    events: content.events,
    gallery: content.gallery,
    faqs: content.faqs,
    blog: content.blog,
    "success-stories": content.successStories,
  };
}

function buildInitialSelections(
  content: AcademyContentData,
): Record<AcademyCollectionSlug, string | null> {
  return {
    services: content.services[0]?.id ?? null,
    events: content.events[0]?.id ?? null,
    gallery: content.gallery[0]?.id ?? null,
    faqs: content.faqs[0]?.id ?? null,
    blog: content.blog[0]?.id ?? null,
    "success-stories": content.successStories[0]?.id ?? null,
  };
}

function isIsoDateField(field: AcademyAdminField) {
  return field.type === "datetime";
}

function formatDateTimeLocal(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function parseDateTimeLocal(value: AcademyAdminFormValue) {
  if (typeof value !== "string" || !value) {
    return "";
  }

  return new Date(value).toISOString();
}

function buildFormState(
  moduleSlug: AcademyCollectionSlug,
  item?: AdminRecord | null,
): AcademyAdminFormState {
  const defaults = academyAdminDefaults[moduleSlug];
  const fields = academyAdminFields[moduleSlug];
  const nextState: AcademyAdminFormState = { ...defaults };

  if (!item) {
    return nextState;
  }

  for (const field of fields) {
    const incomingValue = item[field.name];

    if (incomingValue === undefined || incomingValue === null) {
      continue;
    }

    if (isIsoDateField(field)) {
      nextState[field.name] = formatDateTimeLocal(incomingValue);
      continue;
    }

    if (
      typeof incomingValue === "string" ||
      typeof incomingValue === "number" ||
      typeof incomingValue === "boolean"
    ) {
      nextState[field.name] = incomingValue;
    }
  }

  return nextState;
}

function buildPayload(
  moduleSlug: AcademyCollectionSlug,
  formState: AcademyAdminFormState,
) {
  const payload: Record<string, unknown> = {};

  for (const field of academyAdminFields[moduleSlug]) {
    const value = formState[field.name];

    if (field.type === "datetime") {
      payload[field.name] = parseDateTimeLocal(value);
      continue;
    }

    payload[field.name] = value;
  }

  return payload;
}

function getRecordIdentity(moduleSlug: AcademyCollectionSlug, item: AdminRecord) {
  const identityField = academyAdminIdentityField[moduleSlug];
  const value = item[identityField];

  return typeof value === "string" && value.trim()
    ? value
    : "Untitled item";
}

function isImageUrl(value: AcademyAdminFormValue | undefined) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !value.endsWith(".mp4") &&
    !value.endsWith(".webm")
  );
}

export function AdminConsole({
  admin,
  initialContent,
  initialContactSubmissions,
}: AdminConsoleProps) {
  const [recordsByModule, setRecordsByModule] = useState<AdminRecordsByModule>(
    () => mapContentToModules(initialContent),
  );
  const [selectedSection, setSelectedSection] =
    useState<AdminSectionSlug>("services");
  const [selectedItemIds, setSelectedItemIds] = useState<
    Record<AcademyCollectionSlug, string | null>
  >(() => buildInitialSelections(initialContent));
  const [formState, setFormState] = useState<AcademyAdminFormState>(() =>
    buildFormState("services", initialContent.services[0]),
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedModule =
    selectedSection === "contact-submissions" ? null : selectedSection;
  const selectedItems = useMemo(
    () => (selectedModule ? recordsByModule[selectedModule] : []),
    [recordsByModule, selectedModule],
  );
  const selectedItemId = selectedModule ? selectedItemIds[selectedModule] : null;
  const activeItem = useMemo(
    () =>
      selectedModule
        ? selectedItems.find((item) => item.id === selectedItemId) ?? null
        : null,
    [selectedItems, selectedItemId, selectedModule],
  );

  function syncModuleState(
    moduleSlug: AcademyCollectionSlug,
    nextItems: AdminRecord[],
    preferredId?: string | null,
  ) {
    const nextSelectedId =
      (preferredId && nextItems.some((item) => item.id === preferredId)
        ? preferredId
        : nextItems[0]?.id) ?? null;

    setRecordsByModule((current) => ({
      ...current,
      [moduleSlug]: nextItems,
    }));
    setSelectedItemIds((current) => ({
      ...current,
      [moduleSlug]: nextSelectedId,
    }));

    if (moduleSlug === selectedSection) {
      const nextActive =
        nextItems.find((item) => item.id === nextSelectedId) ?? null;
      setFormState(buildFormState(moduleSlug, nextActive));
    }
  }

  async function refreshModule(
    moduleSlug: AcademyCollectionSlug,
    preferredId?: string | null,
  ) {
    const response = await fetch(
      `/api/academy/${moduleSlug}?includeDrafts=true`,
      {
        cache: "no-store",
      },
    );

    const data = (await response.json()) as {
      error?: string;
      items?: AdminRecord[];
    };

    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }

    if (!response.ok || !data.items) {
      throw new Error(data.error ?? "Unable to refresh module.");
    }

    syncModuleState(moduleSlug, data.items, preferredId);
  }

  function handleModuleChange(moduleSlug: AcademyCollectionSlug) {
    setSelectedSection(moduleSlug);
    setNotice(null);
    setError(null);

    const moduleItems = recordsByModule[moduleSlug];
    const existingSelectedId = selectedItemIds[moduleSlug];
    const nextActive =
      moduleItems.find((item) => item.id === existingSelectedId) ??
      moduleItems[0] ??
      null;

    setSelectedItemIds((current) => ({
      ...current,
      [moduleSlug]: nextActive?.id ?? null,
    }));
    setFormState(buildFormState(moduleSlug, nextActive));
  }

  function handleContactSubmissionsChange() {
    setSelectedSection("contact-submissions");
    setNotice(null);
    setError(null);
  }

  function handleSelectExisting(itemId: string) {
    if (!selectedModule) {
      return;
    }

    const item = selectedItems.find((entry) => entry.id === itemId) ?? null;
    setSelectedItemIds((current) => ({
      ...current,
      [selectedModule]: itemId,
    }));
    setFormState(buildFormState(selectedModule, item));
    setNotice(null);
    setError(null);
  }

  function handleCreateNew() {
    if (!selectedModule) {
      return;
    }

    setSelectedItemIds((current) => ({
      ...current,
      [selectedModule]: null,
    }));
    setFormState(buildFormState(selectedModule, null));
    setNotice(null);
    setError(null);
  }

  function handleFieldChange(name: string, value: AcademyAdminFormValue) {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSave() {
    if (!selectedModule) {
      return;
    }

    setNotice(null);
    setError(null);

    startTransition(async () => {
      try {
        const payload = buildPayload(selectedModule, formState);
        const isEditing = Boolean(selectedItemId);
        const endpoint = isEditing
          ? `/api/academy/${selectedModule}/${selectedItemId}`
          : `/api/academy/${selectedModule}`;
        const method = isEditing ? "PATCH" : "POST";

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as {
          error?: string;
          item?: AdminRecord;
        };

        if (response.status === 401) {
          window.location.assign("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to save content.");
        }

        await refreshModule(selectedModule, data.item?.id ?? null);
        setNotice(
          isEditing
            ? "Content updated successfully."
            : "Content created successfully.",
        );
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save content.",
        );
      }
    });
  }

  function handleDelete() {
    if (!selectedModule || !selectedItemId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this item permanently from the selected module?",
    );

    if (!shouldDelete) {
      return;
    }

    setNotice(null);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/academy/${selectedModule}/${selectedItemId}`,
          {
            method: "DELETE",
          },
        );

        const data = (await response.json()) as { error?: string };

        if (response.status === 401) {
          window.location.assign("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to delete content.");
        }

        await refreshModule(selectedModule, null);
        setNotice("Content deleted successfully.");
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete content.",
        );
      }
    });
  }

  async function handleUpload(fieldName: string, file: File) {
    if (!selectedModule) {
      return;
    }

    setError(null);
    setNotice(null);
    setUploadingField(fieldName);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", academyAdminUploadFolder[selectedModule]);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        upload?: { url: string };
      };

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok || !data.upload) {
        throw new Error(data.error ?? "Unable to upload image.");
      }

      setFormState((current) => ({
        ...current,
        [fieldName]: data.upload?.url ?? "",
      }));
      setNotice("Image uploaded to Cloudinary.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setUploadingField(null);
    }
  }

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      window.location.assign("/admin/login");
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[92rem] flex-col px-5 py-6 sm:px-8 lg:px-10">
      <section className="glass-panel rounded-[34px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
              Academy Admin
            </p>
            <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Manage academy content, uploads, and publishing.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/80">
              This panel writes directly to MongoDB, uses Cloudinary for image
              uploads, and protects content changes behind an admin login.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200">
              {admin.name} | {admin.email}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-semibold text-white hover:border-cyan-300/35 hover:bg-cyan-300/10 disabled:opacity-70"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[18rem_20rem_minmax(0,1fr)]">
          <aside className="space-y-3">
            {(
              Object.entries(academyModuleRegistry) as Array<
                [AcademyCollectionSlug, (typeof academyModuleRegistry)[AcademyCollectionSlug]]
              >
            ).map(([moduleSlug, moduleConfig]) => {
              const count = recordsByModule[moduleSlug].length;

              return (
                <button
                  key={moduleSlug}
                  type="button"
                  onClick={() => handleModuleChange(moduleSlug)}
                  className={`w-full rounded-[26px] border px-4 py-4 text-left ${
                    selectedSection === moduleSlug
                      ? "border-cyan-300/40 bg-cyan-300/12"
                      : "border-white/10 bg-black/20 hover:border-cyan-300/25 hover:bg-cyan-300/8"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg text-white">
                        {moduleConfig.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300/75">
                        {moduleConfig.description}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleContactSubmissionsChange}
              className={`w-full rounded-[26px] border px-4 py-4 text-left ${
                selectedSection === "contact-submissions"
                  ? "border-cyan-300/40 bg-cyan-300/12"
                  : "border-white/10 bg-black/20 hover:border-cyan-300/25 hover:bg-cyan-300/8"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-white">
                    Contact Submissions
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300/75">
                    Website enquiries and admin follow-up tracking.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                  {initialContactSubmissions.length}
                </span>
              </div>
            </button>
          </aside>

          {selectedSection === "contact-submissions" ? (
            <div className="xl:col-span-2">
              <AdminContactSubmissionsPanel
                initialSubmissions={initialContactSubmissions}
                embedded
              />
            </div>
          ) : (
            <>
          <section className="rounded-[30px] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Records
                </p>
                <p className="mt-2 font-display text-xl text-white">
                  {selectedModule ? academyModuleRegistry[selectedModule].label : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex h-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-50 hover:border-cyan-300/40"
              >
                Create New
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/12 px-4 py-5 text-sm text-slate-400">
                  No items yet in this module.
                </div>
              ) : null}

              {selectedItems.map((item) => {
                const isActive = item.id === selectedItemId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectExisting(String(item.id))}
                    className={`w-full rounded-2xl border px-4 py-4 text-left ${
                      isActive
                        ? "border-cyan-300/35 bg-cyan-300/10"
                        : "border-white/10 bg-slate-950/55 hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {getRecordIdentity(selectedModule!, item)}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                          {item.published ? "Published" : "Draft"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {typeof item.updatedAt === "string"
                          ? formatStableDate(item.updatedAt)
                          : ""}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-black/20 p-5">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Editor
                </p>
                <p className="mt-2 font-display text-2xl text-white">
                  {activeItem ? "Edit Content" : "Create Content"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {activeItem ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-rose-400/25 bg-rose-400/10 px-5 text-sm font-semibold text-rose-100 disabled:opacity-70"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0f2fe_0%,#93c5fd_44%,#38bdf8_100%)] px-5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.32)] disabled:opacity-70"
                >
                  {isPending ? "Saving..." : activeItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {(selectedModule ? academyAdminFields[selectedModule] : []).map((field) => {
                const value = formState[field.name];
                const wideField =
                  field.type === "textarea" || field.type === "image";

                return (
                  <div
                    key={field.name}
                    className={wideField ? "md:col-span-2" : ""}
                  >
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {field.label}
                      </span>

                      {field.type === "textarea" ? (
                        <textarea
                          value={String(value ?? "")}
                          onChange={(event) =>
                            handleFieldChange(field.name, event.target.value)
                          }
                          rows={5}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                        />
                      ) : null}

                      {field.type === "text" ? (
                        <input
                          type="text"
                          value={String(value ?? "")}
                          onChange={(event) =>
                            handleFieldChange(field.name, event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                        />
                      ) : null}

                      {field.type === "number" ? (
                        <input
                          type="number"
                          value={Number(value ?? 0)}
                          onChange={(event) =>
                            handleFieldChange(
                              field.name,
                              Number(event.target.value),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                        />
                      ) : null}

                      {field.type === "datetime" ? (
                        <input
                          type="datetime-local"
                          value={String(value ?? "")}
                          onChange={(event) =>
                            handleFieldChange(field.name, event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                        />
                      ) : null}

                      {field.type === "select" ? (
                        <select
                          value={String(value ?? "")}
                          onChange={(event) =>
                            handleFieldChange(field.name, event.target.value)
                          }
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                        >
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null}

                      {field.type === "checkbox" ? (
                        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(event) =>
                              handleFieldChange(field.name, event.target.checked)
                            }
                            className="h-4 w-4 accent-cyan-400"
                          />
                          <span className="text-sm text-slate-200">
                            {field.label}
                          </span>
                        </div>
                      ) : null}

                      {field.type === "image" ? (
                        <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950/65 p-4">
                          {isImageUrl(value) ? (
                            <Image
                              src={String(value)}
                              alt={field.label}
                              width={640}
                              height={360}
                              className="h-48 w-full rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/12 text-sm text-slate-500">
                              No image uploaded yet
                            </div>
                          )}

                          <input
                            type="text"
                            value={String(value ?? "")}
                            onChange={(event) =>
                              handleFieldChange(field.name, event.target.value)
                            }
                            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                            placeholder="https://..."
                          />

                          <label className="mt-4 flex cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-slate-200 hover:border-cyan-300/25">
                            <span>
                              {uploadingField === field.name
                                ? "Uploading image..."
                                : "Upload from your computer"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/10 file:px-4 file:py-2 file:font-semibold file:text-cyan-50"
                              disabled={uploadingField === field.name}
                              onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                  void handleUpload(field.name, file);
                                }

                                event.currentTarget.value = "";
                              }}
                            />
                          </label>
                        </div>
                      ) : null}
                    </label>

                    {field.helpText ? (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {field.helpText}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
