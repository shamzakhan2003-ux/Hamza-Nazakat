import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import {
  createCustomerSession,
  normalizeEmail,
  normalizePhone,
} from "@/app/lib/customerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const identifier = String(body.identifier || "").trim();
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        {
          error: "Email/mobile number and password are required.",
        },
        { status: 400 }
      );
    }

    const email = normalizeEmail(identifier);
    const phone = normalizePhone(identifier);

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          error: "Invalid email/mobile number or password.",
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      customer.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid email/mobile number or password.",
        },
        { status: 401 }
      );
    }

    if (!customer.mobileVerified) {
      return NextResponse.json(
        {
          error:
            "Your mobile number is not verified. Please verify it before continuing.",
          requiresMobileVerification: true,
          phone: customer.phone,
        },
        { status: 403 }
      );
    }

    await createCustomerSession(customer.id);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        mobileVerified: customer.mobileVerified,
      },
    });
  } catch (error) {
    console.error("Customer login error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}