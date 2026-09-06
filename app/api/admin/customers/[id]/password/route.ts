import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function checkAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  return adminSession?.value === "authenticated";
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const customerId = Number(id);

    if (!Number.isInteger(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newPassword =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!newPassword) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customer password reset successfully.",
    });
  } catch (error) {
    console.error(
      "Admin customer password reset API error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to reset customer password." },
      { status: 500 }
    );
  }
}