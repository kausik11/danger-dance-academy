import { NextResponse } from "next/server";
import {
  academyModuleRegistry,
  isAcademyCollectionSlug,
} from "@/lib/academy-cms";
import {
  createAcademyModuleItem,
  listAcademyModuleWithFallback,
} from "@/lib/academy-cms-store";
import {
  AdminAuthorizationError,
  requireAdminRouteSession,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ModuleRouteContext = {
  params: Promise<{
    module: string;
  }>;
};

function createNotFoundResponse(moduleSlug: string) {
  return NextResponse.json(
    {
      error: `Unknown academy module "${moduleSlug}".`,
      availableModules: Object.keys(academyModuleRegistry),
    },
    { status: 404 },
  );
}

export async function GET(request: Request, context: ModuleRouteContext) {
  try {
    const { module: moduleSlug } = await context.params;

    if (!isAcademyCollectionSlug(moduleSlug)) {
      return createNotFoundResponse(moduleSlug);
    }

    const url = new URL(request.url);
    const includeDrafts = url.searchParams.get("includeDrafts") === "true";
    const collection = await listAcademyModuleWithFallback(moduleSlug);
    const filtered = includeDrafts
      ? collection
      : collection.filter((item) => item.published);

    return NextResponse.json({
      module: moduleSlug,
      label: academyModuleRegistry[moduleSlug].label,
      total: filtered.length,
      items: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load academy module content.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: ModuleRouteContext) {
  try {
    await requireAdminRouteSession();

    const { module: moduleSlug } = await context.params;

    if (!isAcademyCollectionSlug(moduleSlug)) {
      return createNotFoundResponse(moduleSlug);
    }

    const body = await request.json();
    const item = await createAcademyModuleItem(moduleSlug, body);

    return NextResponse.json(
      {
        message: `${academyModuleRegistry[moduleSlug].label} item created.`,
        item,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create academy content item in MongoDB.",
      },
      { status: 400 },
    );
  }
}
