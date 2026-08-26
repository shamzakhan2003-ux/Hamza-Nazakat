import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import {
  createCustomerSession,
  normalizePhone,
} from "@/app/lib/customerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phone = normalizePhone(String(body.phone || ""));
    const otp = String(body.otp || "").trim();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Mobile number and OTP are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        phone,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer account not found." },
        { status: 404 }
      );
    }

    if (customer.mobileVerified) {
      return NextResponse.json(
        { error: "Mobile number is already verified." },
        { status: 400 }
      );
    }

    if (!customer.otpHash || !customer.otpExpiresAt) {
      return NextResponse.json(
        { error: "OTP is not available. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (customer.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (customer.otpAttempts >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (otpHash !== customer.otpHash) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          otpAttempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        mobileVerified: true,
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    await createCustomerSession(customer.id);

    return NextResponse.json({
      success: true,
      message: "Mobile number verified successfully.",
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        mobileVerified: true,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying OTP." },
      { status: 500 }
    );
  }
}