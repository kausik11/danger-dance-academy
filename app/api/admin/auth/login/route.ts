import { NextResponse } from "next/server";
import { authenticateAdmin, hasAnyAdminUser } from "@/lib/admin-users";
import {
  createAdminSessionToken,
  adminSessionCookieName,
  getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      const hasAdmin = await hasAnyAdminUser();

      return NextResponse.json(
        {
          error: hasAdmin
            ? "Invalid admin email or password."
            : "No admin user exists yet. Set ADMIN_EMAIL and ADMIN_PASSWORD.",
        },
        { status: hasAdmin ? 401 : 500 },
      );
    }

    const token = await createAdminSessionToken(admin);
    const response = NextResponse.json({
      message: "Admin login successful.",
      admin,
    });

    response.cookies.set(
      adminSessionCookieName,
      token,
      getAdminSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to login admin.",
      },
      { status: 500 },
    );
  }
}
