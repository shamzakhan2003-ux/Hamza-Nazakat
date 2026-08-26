import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "customer_session";
const SESSION_DAYS = 30;

export function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").trim();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createCustomerSession(customerId: number) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.customerSession.create({
    data: {
      customerId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const session = await prisma.customerSession.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: session.customerId,
    },
  });

  if (!customer) {
    await prisma.customerSession.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return customer;
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);

    await prisma.customerSession.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}