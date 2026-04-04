import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ message: "Admin logged out." });

  response.cookies.set(adminSessionCookieName, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
