"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
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

type AdminSectionEntry = {
  slug: AdminSectionSlug;
  label: string;
  description: string;
  count: number;
  icon: LucideIcon;
};

type AdminSummaryCard = {
  label: string;
  value: string;
  accent: string;
  icon: LucideIcon;
};

const sectionIconMap: Record<AdminSectionSlug, LucideIcon> = {
  services: BriefcaseBusiness,
  events: CalendarDays,
  gallery: Images,
  faqs: CircleHelp,
  blog: BookOpenText,
  "success-stories": Sparkles,
  "contact-submissions": Inbox,
};

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] px-5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.28)] hover:shadow-[0_24px_44px_rgba(37,99,235,0.34)] disabled:cursor-not-allowed disabled:opacity-70";
const secondaryButtonClassName =
  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8e5fb] bg-[#dbeafe] px-5 text-sm font-semibold text-slate-800 hover:border-[#bfdbfe] hover:bg-[#cfe2ff] disabled:cursor-not-allowed disabled:opacity-70";
const surfaceClassName =
  "rounded-[28px] border border-[#d9e5fb] bg-white shadow-[0_18px_50px_rgba(37,99,235,0.08)]";
const mutedEyebrowClassName =
  "text-[11px] uppercase tracking-[0.24em] text-slate-500";
const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#d8e5fb] bg-[#f8fbff] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#93c5fd] focus:bg-white";

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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getLatestDateLabel(items: Array<{ updatedAt?: string; createdAt?: string }>) {
  const latest = items
    .map((item) => item.updatedAt ?? item.createdAt ?? "")
    .filter(Boolean)
    .sort((left, right) => right.localeCompare(left))[0];

  return latest ? formatStableDate(latest) : "--";
}

function matchesSearchQuery(item: AdminRecord, query: string) {
  if (!query) {
    return true;
  }

  return Object.values(item).some((value) => {
    if (typeof value === "string") {
      return value.toLowerCase().includes(query);
    }

    if (typeof value === "number") {
      return value.toString().includes(query);
    }

    return false;
  });
}

function buildSummaryCards(
  selectedSection: AdminSectionSlug,
  selectedItems: AdminRecord[],
  contactSubmissions: ContactSubmission[],
): AdminSummaryCard[] {
  if (selectedSection === "contact-submissions") {
    const connectedCount = contactSubmissions.filter(
      (submission) => submission.isConnected,
    ).length;
    const pendingCount = contactSubmissions.length - connectedCount;

    return [
      {
        label: "Inbox Total",
        value: String(contactSubmissions.length),
        accent: "bg-[#dbeafe] text-[#2563eb]",
        icon: Inbox,
      },
      {
        label: "Connected",
        value: String(connectedCount),
        accent: "bg-[#dcfce7] text-[#15803d]",
        icon: CheckCircle2,
      },
      {
        label: "Pending",
        value: String(pendingCount),
        accent: "bg-[#e0ecff] text-[#2563eb]",
        icon: Clock3,
      },
      {
        label: "Latest Request",
        value: getLatestDateLabel(contactSubmissions),
        accent: "bg-[#eef4ff] text-[#1d4ed8]",
        icon: Bell,
      },
    ];
  }

  const publishedCount = selectedItems.filter((item) => item.published).length;
  const draftCount = selectedItems.length - publishedCount;
  const featuredCount = selectedItems.filter((item) => item.featured === true).length;

  return [
    {
      label: "Total Records",
      value: String(selectedItems.length),
      accent: "bg-[#dbeafe] text-[#2563eb]",
      icon: LayoutDashboard,
    },
    {
      label: "Published",
      value: String(publishedCount),
      accent: "bg-[#dcfce7] text-[#15803d]",
      icon: CheckCircle2,
    },
    {
      label: "Drafts",
      value: String(draftCount),
      accent: "bg-[#e0ecff] text-[#2563eb]",
      icon: Clock3,
    },
    {
      label: featuredCount > 0 ? "Featured" : "Last Updated",
      value: featuredCount > 0 ? String(featuredCount) : getLatestDateLabel(selectedItems),
      accent: "bg-[#eef4ff] text-[#1d4ed8]",
      icon: featuredCount > 0 ? Star : RefreshCw,
    },
  ];
}

export function AdminConsole({
  admin,
  initialContent,
  initialContactSubmissions,
}: AdminConsoleProps) {
  const [recordsByModule, setRecordsByModule] = useState<AdminRecordsByModule>(
    () => mapContentToModules(initialContent),
  );
  const [contactSubmissions, setContactSubmissions] = useState(
    initialContactSubmissions,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
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
  const sectionEntries = useMemo(() => {
    const moduleEntries = Object.entries(academyModuleRegistry) as Array<
      [
        AcademyCollectionSlug,
        (typeof academyModuleRegistry)[AcademyCollectionSlug],
      ]
    >;

    return [
      ...moduleEntries.map(([moduleSlug, moduleConfig]) => ({
        slug: moduleSlug,
        label: moduleConfig.label,
        description: moduleConfig.description,
        count: recordsByModule[moduleSlug].length,
        icon: sectionIconMap[moduleSlug],
      })),
      {
        slug: "contact-submissions" as const,
        label: "Contact Submissions",
        description: "Website enquiries and admin follow-up tracking.",
        count: contactSubmissions.length,
        icon: sectionIconMap["contact-submissions"],
      },
    ] satisfies AdminSectionEntry[];
  }, [contactSubmissions.length, recordsByModule]);
  const selectedSectionEntry = sectionEntries.find(
    (section) => section.slug === selectedSection,
  )!;
  const filteredSectionEntries = useMemo(() => {
    if (!normalizedSearchQuery) {
      return sectionEntries;
    }

    return sectionEntries.filter((section) =>
      `${section.label} ${section.description}`
        .toLowerCase()
        .includes(normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, sectionEntries]);
  const filteredSelectedItems = useMemo(() => {
    if (!selectedModule || !normalizedSearchQuery) {
      return selectedItems;
    }

    return selectedItems.filter((item) =>
      matchesSearchQuery(item, normalizedSearchQuery),
    );
  }, [normalizedSearchQuery, selectedItems, selectedModule]);
  const summaryCards = useMemo(
    () =>
      buildSummaryCards(selectedSection, selectedItems, contactSubmissions),
    [contactSubmissions, selectedItems, selectedSection],
  );
  const selectedFields = selectedModule ? academyAdminFields[selectedModule] : [];
  const SelectedSectionIcon = selectedSectionEntry.icon;
  const overviewTitle =
    selectedSection === "contact-submissions"
      ? "Admin Dashboard"
      : `${selectedSectionEntry.label} Dashboard`;
  const overviewDescription =
    selectedSection === "contact-submissions"
      ? "Review incoming enquiries, update follow-up state, and keep the inbox organized."
      : `Manage ${selectedSectionEntry.label.toLowerCase()}, uploads, and publishing from one workspace.`;

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

  function handleRefreshCurrent() {
    setNotice(null);
    setError(null);

    startTransition(async () => {
      try {
        if (selectedModule) {
          await refreshModule(selectedModule, selectedItemId);
          setNotice(`${selectedSectionEntry.label} refreshed.`);
          return;
        }

        window.location.reload();
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Unable to refresh this section.",
        );
      }
    });
  }

  function handlePrimaryOverviewAction() {
    if (selectedSection === "contact-submissions") {
      document.getElementById("admin-workspace")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    handleCreateNew();
    document.getElementById("admin-workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function renderField(field: AcademyAdminField) {
    const value = formState[field.name];
    const wideField = field.type === "textarea" || field.type === "image";

    return (
      <div key={field.name} className={wideField ? "md:col-span-2" : ""}>
        <label className="block">
          <span className={mutedEyebrowClassName}>{field.label}</span>

          {field.type === "textarea" ? (
            <textarea
              value={String(value ?? "")}
              onChange={(event) =>
                handleFieldChange(field.name, event.target.value)
              }
              rows={5}
              placeholder={field.placeholder}
              className={inputClassName}
            />
          ) : null}

          {field.type === "text" ? (
            <input
              type="text"
              value={String(value ?? "")}
              onChange={(event) =>
                handleFieldChange(field.name, event.target.value)
              }
              placeholder={field.placeholder}
              className={inputClassName}
            />
          ) : null}

          {field.type === "number" ? (
            <input
              type="number"
              value={typeof value === "number" ? value : ""}
              onChange={(event) =>
                handleFieldChange(field.name, Number(event.target.value))
              }
              className={inputClassName}
            />
          ) : null}

          {field.type === "datetime" ? (
            <input
              type="datetime-local"
              value={String(value ?? "")}
              onChange={(event) =>
                handleFieldChange(field.name, event.target.value)
              }
              className={inputClassName}
            />
          ) : null}

          {field.type === "select" ? (
            <select
              value={String(value ?? "")}
              onChange={(event) =>
                handleFieldChange(field.name, event.target.value)
              }
              className={inputClassName}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}

          {field.type === "checkbox" ? (
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#d8e5fb] bg-[#f8fbff] px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) =>
                  handleFieldChange(field.name, event.target.checked)
                }
                className="h-4 w-4 accent-[#2563eb]"
              />
              <span className="text-sm font-medium text-slate-700">
                {field.label}
              </span>
            </div>
          ) : null}

          {field.type === "image" ? (
            <div className="mt-2 rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
              {isImageUrl(value) ? (
                <Image
                  src={String(value)}
                  alt={field.label}
                  width={640}
                  height={360}
                  className="h-48 w-full rounded-[20px] object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-[20px] border border-dashed border-[#cddcf8] bg-white text-sm text-slate-400">
                  No image uploaded yet
                </div>
              )}

              <input
                type="text"
                value={String(value ?? "")}
                onChange={(event) =>
                  handleFieldChange(field.name, event.target.value)
                }
                className={`${inputClassName} bg-white`}
                placeholder="https://..."
              />

              <label className="mt-4 flex cursor-pointer flex-col gap-3 rounded-[20px] border border-[#d8e5fb] bg-white px-4 py-4 text-sm text-slate-700 hover:border-[#bfdbfe] hover:bg-[#f8fbff]">
                <span>
                  {uploadingField === field.name
                    ? "Uploading image..."
                    : "Upload from your computer"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-[#dbeafe] file:px-4 file:py-2 file:font-semibold file:text-[#2563eb]"
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
  }

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[276px] shrink-0 border-r border-[#dbe7ff] bg-white/88 px-5 py-6 backdrop-blur lg:flex lg:flex-col">
          <div className="rounded-[28px] border border-[#d8e5fb] bg-[linear-gradient(135deg,rgba(239,246,255,0.96)_0%,rgba(255,255,255,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#2563eb]">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className={mutedEyebrowClassName}>Protected Panel</p>
                <p className="mt-1 font-display text-xl text-slate-900">
                  Academy CMS
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Content editing, uploads, and enquiry review in one place.
            </p>
          </div>

          <div className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {filteredSectionEntries.map((section) => {
              const isActive = selectedSection === section.slug;
              const SectionIcon = section.icon;
              const onClick =
                section.slug === "contact-submissions"
                  ? handleContactSubmissionsChange
                  : () => handleModuleChange(section.slug);

              return (
                <button
                  key={section.slug}
                  type="button"
                  onClick={onClick}
                  className={`flex w-full items-center gap-3 rounded-[22px] border px-4 py-4 text-left ${
                    isActive
                      ? "border-[#bfdbfe] bg-[linear-gradient(135deg,rgba(219,234,254,0.9)_0%,rgba(255,255,255,1)_100%)] shadow-[0_12px_28px_rgba(37,99,235,0.12)]"
                      : "border-transparent bg-transparent hover:border-[#d8e5fb] hover:bg-[#f8fbff]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isActive
                        ? "bg-[#dbeafe] text-[#2563eb]"
                        : "bg-[#eef4ff] text-[#3b82f6]"
                    }`}
                  >
                    <SectionIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {section.label}
                      </p>
                      <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                        {section.count}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredSectionEntries.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#d8e5fb] px-4 py-5 text-sm text-slate-500">
                No admin sections match this search.
              </div>
            ) : null}
          </div>

          <div className="mt-6 rounded-[24px] border border-[#d8e5fb] bg-[#f8fbff] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#2563eb]">
                <span className="text-sm font-bold">{getInitials(admin.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {admin.name}
                </p>
                <p className="truncate text-xs text-slate-500">{admin.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#d8e5fb] bg-white text-sm font-semibold text-slate-700 hover:border-[#bfdbfe] hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#dbe7ff] bg-[#f8fbff]/92 backdrop-blur">
            <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
              <label className="relative block w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search content, services, enquiries"
                  className="h-12 w-full rounded-2xl border border-[#d8e5fb] bg-white pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#93c5fd]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRefreshCurrent}
                  disabled={isPending}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-slate-600 hover:border-[#bfdbfe] hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Refresh current section"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("admin-workspace")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8e5fb] bg-white text-slate-600 hover:border-[#bfdbfe] hover:bg-[#eef4ff]"
                  aria-label="Jump to workspace"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-[#d8e5fb] bg-white px-4 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dbeafe] text-sm font-bold text-[#2563eb]">
                    {getInitials(admin.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {admin.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">admin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4 sm:px-8 lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {sectionEntries.map((section) => {
                  const isActive = selectedSection === section.slug;
                  const SectionIcon = section.icon;
                  const onClick =
                    section.slug === "contact-submissions"
                      ? handleContactSubmissionsChange
                      : () => handleModuleChange(section.slug);

                  return (
                    <button
                      key={section.slug}
                      type="button"
                      onClick={onClick}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? "border-[#bfdbfe] bg-[#dbeafe] text-[#1d4ed8]"
                          : "border-[#d8e5fb] bg-white text-slate-700"
                      }`}
                    >
                      <SectionIcon className="h-4 w-4" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>
          <section className="flex-1 px-5 py-6 sm:px-8">
            <div className="mx-auto max-w-[110rem] space-y-6">
              <section
                className={`${surfaceClassName} overflow-hidden bg-[linear-gradient(135deg,rgba(219,234,254,0.88)_0%,rgba(255,255,255,0.98)_64%,rgba(239,246,255,0.95)_100%)] p-6 sm:p-8`}
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <p className={mutedEyebrowClassName}>Overview</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#2563eb]">
                        <SelectedSectionIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="font-display text-3xl text-slate-900 sm:text-4xl">
                          {overviewTitle}
                        </h1>
                        <p className="mt-2 text-sm leading-7 text-slate-500">
                          {overviewDescription}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      Current section:{" "}
                      <span className="font-semibold text-slate-800">
                        {selectedSectionEntry.label}
                      </span>{" "}
                      with {selectedSectionEntry.count} total records.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handlePrimaryOverviewAction}
                      disabled={isPending}
                      className={primaryButtonClassName}
                    >
                      <Plus className="h-4 w-4" />
                      {selectedSection === "contact-submissions"
                        ? "Review inbox"
                        : "Create item"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRefreshCurrent}
                      disabled={isPending}
                      className={secondaryButtonClassName}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {selectedSection === "contact-submissions"
                        ? "Refresh inbox"
                        : "Refresh section"}
                    </button>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 xl:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article key={card.label} className={`${surfaceClassName} p-5`}>
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-5 text-sm text-slate-500">{card.label}</p>
                      <p className="mt-2 font-display text-4xl text-slate-900">
                        {card.value}
                      </p>
                    </article>
                  );
                })}
              </section>

              {notice ? (
                <p className="rounded-[22px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
                  {notice}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-[22px] border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm text-[#b91c1c]">
                  {error}
                </p>
              ) : null}

              {selectedSection === "contact-submissions" ? (
                <div id="admin-workspace">
                  <AdminContactSubmissionsPanel
                    initialSubmissions={contactSubmissions}
                    embedded
                    onSubmissionsChange={setContactSubmissions}
                  />
                </div>
              ) : (
                <section
                  id="admin-workspace"
                  className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]"
                >
                  <section className={`${surfaceClassName} p-5`}>
                    <div className="flex items-start justify-between gap-4 border-b border-[#e5eefc] pb-4">
                      <div>
                        <p className={mutedEyebrowClassName}>Records</p>
                        <p className="mt-2 font-display text-2xl text-slate-900">
                          {selectedSectionEntry.label}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {filteredSelectedItems.length} of {selectedItems.length} shown
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#dbeafe] px-4 text-sm font-semibold text-[#2563eb] hover:bg-[#cfe2ff]"
                      >
                        New
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {selectedItems.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-[#d8e5fb] px-4 py-5 text-sm text-slate-500">
                          No items yet in this module.
                        </div>
                      ) : null}

                      {selectedItems.length > 0 && filteredSelectedItems.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-[#d8e5fb] px-4 py-5 text-sm text-slate-500">
                          No records match the current search.
                        </div>
                      ) : null}
                      {filteredSelectedItems.map((item) => {
                        const isActive = item.id === selectedItemId;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectExisting(String(item.id))}
                            className={`w-full rounded-[22px] border px-4 py-4 text-left ${
                              isActive
                                ? "border-[#bfdbfe] bg-[linear-gradient(135deg,rgba(219,234,254,0.9)_0%,rgba(255,255,255,1)_100%)] shadow-[0_12px_24px_rgba(37,99,235,0.08)]"
                                : "border-[#e5eefc] bg-[#f8fbff] hover:border-[#bfdbfe] hover:bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">
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

                  <section className={`${surfaceClassName} p-5 sm:p-6`}>
                    <div className="flex flex-col gap-4 border-b border-[#e5eefc] pb-5 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className={mutedEyebrowClassName}>Editor</p>
                        <p className="mt-2 font-display text-3xl text-slate-900">
                          {activeItem ? "Edit Content" : "Create Content"}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {selectedSectionEntry.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {activeItem ? (
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-5 text-sm font-semibold text-[#b91c1c] hover:bg-[#ffe4e6] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Delete
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={isPending}
                          className={primaryButtonClassName}
                        >
                          {isPending
                            ? "Saving..."
                            : activeItem
                              ? "Save changes"
                              : "Create item"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      {selectedFields.map(renderField)}
                    </div>
                  </section>
                </section>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
