import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import cloudinary from "../../lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // =========================
    // ADMIN AUTHENTICATION
    // =========================

    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    // =========================
    // GET FILE
    // =========================

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file provided.",
        },
        { status: 400 }
      );
    }

    // =========================
    // FILE VALIDATION
    // =========================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, WEBP and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Image size must be less than 5MB.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CONVERT FILE TO DATA URI
    // =========================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");

    const dataUri = `data:${file.type};base64,${base64}`;

    // =========================
    // CLOUDINARY UPLOAD
    // =========================

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "click-pick/products",
      resource_type: "image",
    });

    // =========================
    // SUCCESS
    // =========================

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}
