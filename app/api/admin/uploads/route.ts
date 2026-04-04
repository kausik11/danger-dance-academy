import { NextResponse } from "next/server";
import {
  AdminAuthorizationError,
  requireAdminRouteSession,
} from "@/lib/admin-session";
import { uploadAdminImageToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdminRouteSession();

    const formData = await request.formData();
    const file = formData.get("file");
    const folderInput = formData.get("folder");
    const folder =
      typeof folderInput === "string" && folderInput.trim()
        ? folderInput.trim()
        : "danger-dance-academy/admin";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    const upload = await uploadAdminImageToCloudinary(file, folder);

    return NextResponse.json({
      message: "Image uploaded successfully.",
      upload,
    });
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to upload image.",
      },
      { status: 500 },
    );
  }
}
