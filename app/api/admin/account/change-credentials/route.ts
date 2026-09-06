import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const adminSession = request.headers.get("cookie") || "";

    if (!adminSession.includes("admin_session=authenticated")) {
      return NextResponse.json(
        { error: "Admin authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const newUsername = String(body.username || "").trim();
    const newPassword = String(body.password || "");

    if (!newUsername || !newPassword) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (newUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const cookies = adminSession
      .split(";")
      .map((item) => item.trim());

    const verificationCookie = cookies.find((item) =>
      item.startsWith("admin_account_verified=")
    );

    if (!verificationCookie) {
      return NextResponse.json(
        { error: "OTP verification is required." },
        { status: 403 }
      );
    }

    const verificationToken = verificationCookie
      .substring("admin_account_verified=".length);

    const tokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verifiedOtp = await prisma.adminOtp.findFirst({
      where: {
        otpHash: tokenHash,
        verifiedAt: {
          not: null,
        },
      },
      orderBy: {
        verifiedAt: "desc",
      },
    });

    if (!verifiedOtp || !verifiedOtp.verifiedAt) {
      return NextResponse.json(
        { error: "OTP verification is invalid or expired." },
        { status: 403 }
      );
    }

    const verifiedAt = verifiedOtp.verifiedAt.getTime();

    if (Date.now() - verifiedAt > 15 * 60 * 1000) {
      return NextResponse.json(
        { error: "OTP verification has expired." },
        { status: 403 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const currentAdmin = await prisma.adminAccount.findFirst();

    if (!currentAdmin) {
      return NextResponse.json(
        { error: "Admin account was not found." },
        { status: 404 }
      );
    }

    const usernameExists = await prisma.adminAccount.findFirst({
      where: {
        username: newUsername,
        NOT: {
          id: currentAdmin.id,
        },
      },
    });

    if (usernameExists) {
      return NextResponse.json(
        { error: "This username is already in use." },
        { status: 409 }
      );
    }

    await prisma.adminAccount.update({
      where: {
        id: currentAdmin.id,
      },
      data: {
        username: newUsername,
        passwordHash,
      },
    });

    await prisma.adminOtp.delete({
      where: {
        id: verifiedOtp.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin account credentials updated successfully.",
    });

    response.cookies.set("admin_account_verified", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("ADMIN CHANGE CREDENTIALS ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating credentials." },
      { status: 500 }
    );
  }
}