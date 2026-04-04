import { NextResponse } from "next/server";
import {
  createContactSubmission,
  isEmail,
  isPhone,
  normalizeText,
} from "@/lib/contact-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      preferredCenterId?: string;
      message?: string;
    };

    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const phone = normalizeText(body.phone);
    const preferredCenterId = normalizeText(body.preferredCenterId);
    const message = normalizeText(body.message);

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 },
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!isPhone(phone)) {
      return NextResponse.json(
        { error: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (message.length < 12) {
      return NextResponse.json(
        { error: "Message should be at least 12 characters long." },
        { status: 400 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
    const ipAddress = forwardedFor.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";

    const submission = await createContactSubmission({
      name,
      email,
      phone,
      preferredCenterId,
      message,
      userAgent,
      ipAddress,
    });

    return NextResponse.json(
      {
        message: "Your enquiry has been sent. The academy team will contact you shortly.",
        submissionId: submission.id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit the contact form right now.",
      },
      { status: 500 },
    );
  }
}
