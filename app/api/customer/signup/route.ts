import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import {
  generateOtp,
  normalizeEmail,
  normalizePhone,
} from "@/app/lib/customerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || "").trim();
    const email = normalizeEmail(String(body.email || ""));
    const phone = normalizePhone(String(body.phone || ""));
    const password = String(body.password || "");

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid mobile number." },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      if (existingCustomer.phone === phone) {
        return NextResponse.json(
          {
            error:
              "An account with this mobile number already exists.",
          },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const otp = generateOtp();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const customer = await prisma.customer.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,

        mobileVerified: false,

        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
      },
    });

    /*
      DEVELOPMENT MODE

      Real SMS service will be connected later.

      For now, the OTP is returned in the response
      so we can test the complete customer
      registration and verification flow.
    */

    return NextResponse.json({
      success: true,
      message:
        "Account created. Please verify your mobile number.",

      customerId: customer.id,

      requiresMobileVerification: true,

      developmentOtp: otp,
    });
  } catch (error) {
    console.error("Customer signup error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}