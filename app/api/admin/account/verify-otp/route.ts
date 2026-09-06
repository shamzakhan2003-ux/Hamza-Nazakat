import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

const AUTHORIZED_EMAILS = [
  "shamzakhan2003@gmail.com",
  "engineeraasim@yahoo.com",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!AUTHORIZED_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "This email is not authorized." },
        { status: 403 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits." },
        { status: 400 }
      );
    }

    const adminOtp = await prisma.adminOtp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!adminOtp) {
      return NextResponse.json(
        { error: "OTP not found. Please request a new code." },
        { status: 400 }
      );
    }

    if (adminOtp.expiresAt < new Date()) {
      await prisma.adminOtp.delete({
        where: { id: adminOtp.id },
      });

      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (adminOtp.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new code." },
        { status: 429 }
      );
    }

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (otpHash !== adminOtp.otpHash) {
      await prisma.adminOtp.update({
        where: { id: adminOtp.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    await prisma.adminOtp.update({
      where: { id: adminOtp.id },
      data: {
        verifiedAt: new Date(),
        otpHash: verificationTokenHash,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });

    response.cookies.set(
      "admin_account_verified",
      verificationToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60,
      }
    );

    return response;
  } catch (error) {
    console.error("ADMIN VERIFY OTP ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying OTP." },
      { status: 500 }
    );
  }
}