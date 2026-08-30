import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import {
  createCustomerSession,
  normalizeEmail,
} from "@/app/lib/customerAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(String(body.email || ""));
    const otp = String(body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        {
          error: "Email and verification code are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          error: "Verification code must be 6 digits.",
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
          error: "Customer account not found.",
        },
        { status: 404 }
      );
    }

    if (customer.emailVerified) {
      return NextResponse.json(
        {
          error: "Email address is already verified.",
        },
        { status: 400 }
      );
    }

    if (
      !customer.emailOtpHash ||
      !customer.emailOtpExpiresAt
    ) {
      return NextResponse.json(
        {
          error:
            "Verification code is not available. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (customer.emailOtpExpiresAt < new Date()) {
      return NextResponse.json(
        {
          error:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (customer.emailOtpAttempts >= 5) {
      return NextResponse.json(
        {
          error:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    /*
     * Hash the code entered by the customer.
     */

    const emailOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    /*
     * Compare with the hash stored in database.
     */

    if (emailOtpHash !== customer.emailOtpHash) {
      await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          emailOtpAttempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          error: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    /*
     * Email successfully verified.
     */

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        emailVerified: true,
        emailOtpHash: null,
        emailOtpExpiresAt: null,
        emailOtpAttempts: 0,
      },
    });

    /*
     * Create login session after successful verification.
     */

    await createCustomerSession(updatedCustomer.id);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",

      customer: {
        id: updatedCustomer.id,
        fullName: updatedCustomer.fullName,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        emailVerified: true,
        mobileVerified: updatedCustomer.mobileVerified,
      },
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while verifying your email.",
      },
      { status: 500 }
    );
  }
}