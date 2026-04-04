import { NextResponse } from "next/server";
import {
  AdminAuthorizationError,
  requireAdminRouteSession,
} from "@/lib/admin-session";
import { listContactSubmissions } from "@/lib/contact-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminRouteSession();

    const items = await listContactSubmissions();

    return NextResponse.json({
      total: items.length,
      items,
    });
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load contact submissions.",
      },
      { status: 500 },
    );
  }
}
