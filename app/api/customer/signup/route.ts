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

    // Mobile number is required.
    // Mobile verification is NOT required.
    // Email verification is mandatory.
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

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
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

    // Check if a fully created customer already exists.
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return NextResponse.json(
          {
            error: "An account with this email already exists.",
          },
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

    // Remove any previous incomplete signup using this email or phone.
    await prisma.pendingCustomerSignup.deleteMany({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    // Email OTP only.
    const emailOtp = generateOtp();

    const emailOtpHash = crypto
      .createHash("sha256")
      .update(emailOtp)
      .digest("hex");

    const emailOtpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Store signup temporarily.
    // Actual Customer account will be created only after OTP verification.
    await prisma.pendingCustomerSignup.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        emailOtpHash,
        emailOtpExpiresAt,
        emailOtpAttempts: 0,
      },
    });

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing.");

      await prisma.pendingCustomerSignup.delete({
        where: {
          email,
        },
      });

      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Click&Pick <noreply@clickpick.uk>";

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: "Verify your email - Click&Pick",
          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
              "
            >
              <h2 style="color: #f97316;">
                Click&Pick
              </h2>

              <p>Hello ${fullName},</p>

              <p>
                Thank you for creating an account with
                Click&Pick.
              </p>

              <p>
                Please use the following verification code
                to verify your email address:
              </p>

              <div
                style="
                  margin: 25px 0;
                  padding: 20px;
                  background: #f3f4f6;
                  border-radius: 10px;
                  text-align: center;
                "
              >
                <span
                  style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #111827;
                  "
                >
                  ${emailOtp}
                </span>
              </div>

              <p>
                This code will expire in
                <strong>10 minutes</strong>.
              </p>

              <p>
                If you did not create this account,
                you can safely ignore this email.
              </p>

              <p>
                Regards,<br />
                Click&Pick
              </p>
            </div>
          `,
        }),
      }
    );

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();

      console.error(
        "Resend email error:",
        resendError
      );

      await prisma.pendingCustomerSignup.delete({
        where: {
          email,
        },
      });

      return NextResponse.json(
        {
          error:
            "Unable to send verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A verification code has been sent to your email.",
      requiresEmailVerification: true,
      requiresMobileVerification: false,
      email,
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