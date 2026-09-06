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

    /*
     * Find the temporary signup.
     * No Customer account exists at this stage.
     */
    const pendingSignup =
      await prisma.pendingCustomerSignup.findUnique({
        where: {
          email,
        },
      });

    if (!pendingSignup) {
      /*
       * This can happen if the email was already verified
       * or the pending signup no longer exists.
       */
      const existingCustomer =
        await prisma.customer.findUnique({
          where: {
            email,
          },
        });

      if (existingCustomer?.emailVerified) {
        return NextResponse.json(
          {
            error: "Email address is already verified.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Verification code not found. Please sign up again.",
        },
        { status: 404 }
      );
    }

    /*
     * Check OTP expiry.
     */
    if (pendingSignup.emailOtpExpiresAt < new Date()) {
      return NextResponse.json(
        {
          error:
            "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    }

    /*
     * Maximum 5 incorrect attempts.
     */
    if (pendingSignup.emailOtpAttempts >= 5) {
      return NextResponse.json(
        {
          error:
            "Too many incorrect attempts. Please sign up again.",
        },
        { status: 429 }
      );
    }

    /*
     * Hash the OTP entered by the customer.
     */
    const emailOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    /*
     * Compare with stored OTP hash.
     */
    if (emailOtpHash !== pendingSignup.emailOtpHash) {
      await prisma.pendingCustomerSignup.update({
        where: {
          id: pendingSignup.id,
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
     * OTP is correct.
     *
     * Now create the real Customer account and
     * delete the temporary signup in one transaction.
     */
    const customer = await prisma.$transaction(
      async (tx) => {
        /*
         * Double-check email and mobile number before
         * creating the real customer account.
         */
        const existingCustomer =
          await tx.customer.findFirst({
            where: {
              OR: [
                { email: pendingSignup.email },
                { phone: pendingSignup.phone },
              ],
            },
          });

        if (existingCustomer) {
          throw new Error(
            "CUSTOMER_ALREADY_EXISTS"
          );
        }

        const newCustomer =
          await tx.customer.create({
            data: {
              fullName: pendingSignup.fullName,
              email: pendingSignup.email,
              phone: pendingSignup.phone,
              passwordHash: pendingSignup.passwordHash,

              // Email is verified because OTP was successfully verified.
              emailVerified: true,
              emailOtpHash: null,
              emailOtpExpiresAt: null,
              emailOtpAttempts: 0,

              // Mobile verification is NOT required.
              mobileVerified: false,
              otpHash: null,
              otpExpiresAt: null,
              otpAttempts: 0,

              isActive: true,
            },
          });

        /*
         * Remove the temporary signup only after
         * the real Customer has been created.
         */
        await tx.pendingCustomerSignup.delete({
          where: {
            id: pendingSignup.id,
          },
        });

        return newCustomer;
      }
    );

    /*
     * Create login session after successful verification.
     */
    await createCustomerSession(customer.id);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",

      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        emailVerified: true,
        mobileVerified: customer.mobileVerified,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CUSTOMER_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          error:
            "An account with this email or mobile number already exists.",
        },
        { status: 409 }
      );
    }

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