import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        mobileVerified: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      customers: customers.map((customer) => ({
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        mobileVerified: customer.mobileVerified,
        emailVerified: customer.emailVerified,
        isActive: customer.isActive,
        createdAt: customer.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Admin customers API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch customers." },
      { status: 500 }
    );
  }
}