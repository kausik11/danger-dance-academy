import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAuthenticatedAdmin } from "@/lib/admin-session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10 sm:px-8 lg:px-10">
      <section className="glass-panel grid w-full gap-8 overflow-hidden rounded-[34px] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_18rem),linear-gradient(145deg,rgba(2,11,24,0.92),rgba(7,29,53,0.85))] p-6 sm:p-8">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:70px_70px]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
              Admin Access
            </p>
            <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl">
              Protected academy control room.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300/80">
              Sign in with the admin email and password configured on the server
              to manage content, upload images to Cloudinary, and publish
              updates stored in MongoDB Atlas.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "MongoDB Atlas content storage",
                "Cloudinary image uploads",
                "Password-protected admin routes",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
            Login
          </p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Admin Sign In
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300/80">
            Use the bootstrap admin credentials from your environment settings.
          </p>

          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
