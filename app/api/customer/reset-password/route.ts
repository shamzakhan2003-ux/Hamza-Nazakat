import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const otp = String(body.otp || "").trim();

    const newPassword = String(body.newPassword || "");

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Email, OTP and new password are required.",
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

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          error: "Please enter a valid 6-digit OTP.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (!customer || !customer.isActive) {
      return NextResponse.json(
        {
          error: "Invalid or expired OTP.",
        },
        { status: 400 }
      );
    }

    if (
      !customer.passwordResetOtpHash ||
      !customer.passwordResetOtpExpiresAt
    ) {
      return NextResponse.json(
        {
          error: "Invalid or expired OTP.",
        },
        { status: 400 }
      );
    }

    if (
      customer.passwordResetOtpExpiresAt.getTime() <
      Date.now()
    ) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          passwordResetOtpHash: null,
          passwordResetOtpExpiresAt: null,
          passwordResetOtpAttempts: 0,
        },
      });

      return NextResponse.json(
        {
          error: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    if (
      customer.passwordResetOtpAttempts >=
      MAX_OTP_ATTEMPTS
    ) {
      return NextResponse.json(
        {
          error:
            "Too many incorrect OTP attempts. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== customer.passwordResetOtpHash) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          passwordResetOtpAttempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          error: "Invalid OTP.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12
    );

    await prisma.$transaction([
      prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          passwordHash,
          passwordResetOtpHash: null,
          passwordResetOtpExpiresAt: null,
          passwordResetOtpAttempts: 0,
        },
      }),

      prisma.customerSession.deleteMany({
        where: {
          customerId: customer.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while resetting your password.",
      },
      { status: 500 }
    );
  }
}