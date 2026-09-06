import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import {
  createCustomerSession,
  normalizeEmail,
} from "@/app/lib/customerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json(
        {
          error: "Your account has been disabled. Please contact support.",
        },
        { status: 403 }
      );
    }

    if (!customer.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in.",
        },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      customer.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
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