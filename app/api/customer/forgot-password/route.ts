import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/app/lib/prisma";
import { generateOtp, normalizeEmail } from "@/app/lib/customerAuth";

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_EXPIRY_MINUTES = 10;

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(String(body.email || ""));

    if (!email) {
      return NextResponse.json(
        {
          error: "Email address is required.",
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
          error:
            "No account found with this email address. Please create an account first.",
        },
        { status: 404 }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json(
        {
          error:
            "Your account is disabled. Please contact support.",
        },
        { status: 403 }
      );
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        passwordResetOtpHash: otpHash,
        passwordResetOtpExpiresAt: expiresAt,
        passwordResetOtpAttempts: 0,
      },
    });

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Click&Pick <noreply@clickpick.uk>";

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [customer.email],
      subject: "Password Reset OTP - Click&Pick",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">

          <h2 style="color: #f97316;">Click&Pick</h2>

          <p>Hello ${customer.fullName},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Your password reset OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
            background: #f3f4f6;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in
            <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p style="color: #6b7280; margin-top: 30px;">
            Regards,<br />
            Click&Pick Team
          </p>

        </div>
      `,
    });

    if (error) {
      console.error(
        "Resend password reset email error:",
        error
      );

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
          error:
            "Unable to send password reset email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Password reset OTP has been sent to your email address.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}