import { NextResponse } from "next/server";
import {
  academyModuleRegistry,
  isAcademyCollectionSlug,
} from "@/lib/academy-cms";
import {
  deleteAcademyModuleItem,
  getAcademyModuleItem,
  updateAcademyModuleItem,
} from "@/lib/academy-cms-store";
import {
  AdminAuthorizationError,
  requireAdminRouteSession,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ModuleItemRouteContext = {
  params: Promise<{
    module: string;
    id: string;
  }>;
};

function createModuleError(moduleSlug: string) {
  return NextResponse.json(
    {
      error: `Unknown academy module "${moduleSlug}".`,
      availableModules: Object.keys(academyModuleRegistry),
    },
    { status: 404 },
  );
}

export async function GET(_request: Request, context: ModuleItemRouteContext) {
  try {
    const { module: moduleSlug, id } = await context.params;

    if (!isAcademyCollectionSlug(moduleSlug)) {
      return createModuleError(moduleSlug);
    }

    const item = await getAcademyModuleItem(moduleSlug, id);

    if (!item) {
      return NextResponse.json(
        { error: `${academyModuleRegistry[moduleSlug].label} item not found.` },
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
            : "Unable to load academy item.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: ModuleItemRouteContext) {
  try {
    await requireAdminRouteSession();

    const { module: moduleSlug, id } = await context.params;

    if (!isAcademyCollectionSlug(moduleSlug)) {
      return createModuleError(moduleSlug);
    }

    const body = await request.json();
    const item = await updateAcademyModuleItem(moduleSlug, id, body);

    if (!item) {
      return NextResponse.json(
        { error: `${academyModuleRegistry[moduleSlug].label} item not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `${academyModuleRegistry[moduleSlug].label} item updated.`,
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update academy content item in MongoDB.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: ModuleItemRouteContext,
) {
  try {
    await requireAdminRouteSession();

    const { module: moduleSlug, id } = await context.params;

    if (!isAcademyCollectionSlug(moduleSlug)) {
      return createModuleError(moduleSlug);
    }

    const deleted = await deleteAcademyModuleItem(moduleSlug, id);

    if (!deleted) {
      return NextResponse.json(
        { error: `${academyModuleRegistry[moduleSlug].label} item not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `${academyModuleRegistry[moduleSlug].label} item deleted.`,
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
            : "Unable to delete academy item.",
      },
      { status: 500 },
    );
  }
}
