import { NextResponse } from "next/server";
import { academyModuleRegistry } from "@/lib/academy-cms";
import { getAcademyContentWithFallback } from "@/lib/academy-cms-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await getAcademyContentWithFallback();

    return NextResponse.json({
      modules: Object.entries(academyModuleRegistry).map(([slug, config]) => ({
        slug,
        label: config.label,
        description: config.description,
        endpoint: `/api/academy/${slug}`,
        count: content[config.dataKey].length,
      })),
      content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load academy content from MongoDB.",
      },
      { status: 500 },
    );
  }
}
