import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";

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

export async function GET(
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
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
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: {
        ...customer,
        id: String(customer.id),
        createdAt: customer.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin customer details API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch customer details." },
      { status: 500 }
    );
  }
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

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const isActive =
      typeof body.isActive === "boolean"
        ? body.isActive
        : undefined;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Full name, email and phone are required." },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
        NOT: {
          id: customerId,
        },
      },
      select: {
        id: true,
        email: true,
        phone: true,
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return NextResponse.json(
          { error: "This email is already used by another customer." },
          { status: 409 }
        );
      }

      if (existingCustomer.phone === phone) {
        return NextResponse.json(
          { error: "This phone number is already used by another customer." },
          { status: 409 }
        );
      }
    }

    const customer = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        fullName,
        email,
        phone,
        ...(isActive !== undefined ? { isActive } : {}),
      },
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
    });

    return NextResponse.json({
      message: "Customer updated successfully.",
      customer: {
        ...customer,
        id: String(customer.id),
        createdAt: customer.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin customer update API error:", error);

    return NextResponse.json(
      { error: "Failed to update customer." },
      { status: 500 }
    );
  }
}