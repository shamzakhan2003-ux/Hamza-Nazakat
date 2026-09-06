import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

const AUTHORIZED_EMAILS = [
  "shamzakhan2003@gmail.com",
  "engineeraasim@yahoo.com",
];

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!AUTHORIZED_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "This email is not authorized for admin account management." },
        { status: 403 }
      );
    }

    const otp = generateOtp();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.adminOtp.deleteMany({
      where: { email },
    });

    await prisma.adminOtp.create({
      data: {
        email,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is missing.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Click&Pick <onboarding@resend.dev>",
        to: [email],
        subject: "Admin Account Verification Code - Click&Pick",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Admin Account Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 6px;">${otp}</h1>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Regards,<br>Click&Pick</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend error:", resendError);

      await prisma.adminOtp.deleteMany({
        where: { email },
      });

      return NextResponse.json(
        { error: "Unable to send verification code." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("ADMIN REQUEST OTP ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while requesting OTP." },
      { status: 500 }
    );
  }
}