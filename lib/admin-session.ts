import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminById, type AdminProfile } from "@/lib/admin-users";

export const adminSessionCookieName = "danger-dance-admin-session";

type AdminSessionPayload = {
  adminId: string;
  email: string;
  name: string;
  role: "admin";
};

export class AdminAuthorizationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthorizationError";
  }
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET. Add it to your environment before using admin login.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(admin: AdminProfile) {
  const secret = getSessionSecret();

  return new SignJWT({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session?.adminId) {
    return null;
  }

  return getAdminById(session.adminId);
}

export async function requireAdminPageSession() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireAdminRouteSession() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    throw new AdminAuthorizationError();
  }

  return admin;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
