import { AdminConsole } from "@/components/admin/AdminConsole";
import { requireAdminPageSession } from "@/lib/admin-session";
import { getAcademyContent } from "@/lib/academy-cms-store";
import {
  listContactSubmissions,
  type ContactSubmission,
} from "@/lib/contact-submissions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdminPageSession();
  let content = null;
  let contactSubmissions: ContactSubmission[] = [];
  let errorMessage: string | null = null;

  try {
    content = await getAcademyContent();
    contactSubmissions = await listContactSubmissions();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown admin error.";
  }

  if (errorMessage || !content) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <div className="glass-panel rounded-[32px] border border-amber-300/20 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-100/70">
            Admin Backend
          </p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
            Admin configuration is incomplete.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300/80">
            Check your MongoDB, Cloudinary, and admin environment variables,
            then reload this page.
          </p>
          <pre className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-amber-100">
            {errorMessage ?? "Unable to load admin content."}
          </pre>
        </div>
      </main>
    );
  }

  return (
    <AdminConsole
      admin={{ email: admin.email, name: admin.name }}
      initialContent={content}
      initialContactSubmissions={contactSubmissions}
    />
  );
}
