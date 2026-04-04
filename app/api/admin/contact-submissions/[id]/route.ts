import { NextResponse } from "next/server";
import {
  AdminAuthorizationError,
  requireAdminRouteSession,
} from "@/lib/admin-session";
import {
  getContactSubmissionById,
  normalizeText,
  updateContactSubmissionAdminFields,
} from "@/lib/contact-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactSubmissionRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: ContactSubmissionRouteContext,
) {
  try {
    await requireAdminRouteSession();

    const { id } = await context.params;
    const item = await getContactSubmissionById(id);

    if (!item) {
      return NextResponse.json(
        { error: "Contact submission not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the contact submission.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: ContactSubmissionRouteContext,
) {
  try {
    await requireAdminRouteSession();

    const { id } = await context.params;
    const body = (await request.json()) as {
      isConnected?: unknown;
      adminComments?: unknown;
    };

    if (
      body.isConnected !== undefined &&
      typeof body.isConnected !== "boolean"
    ) {
      return NextResponse.json(
        { error: "`isConnected` must be a boolean." },
        { status: 400 },
      );
    }

    if (
      body.adminComments !== undefined &&
      typeof body.adminComments !== "string"
    ) {
      return NextResponse.json(
        { error: "`adminComments` must be a string." },
        { status: 400 },
      );
    }

    const item = await updateContactSubmissionAdminFields(id, {
      isConnected:
        typeof body.isConnected === "boolean" ? body.isConnected : undefined,
      adminComments:
        typeof body.adminComments === "string"
          ? normalizeText(body.adminComments)
          : undefined,
    });

    if (!item) {
      return NextResponse.json(
        { error: "Contact submission not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Contact submission updated.",
      item,
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
            : "Unable to update the contact submission.",
      },
      { status: 500 },
    );
  }
}
