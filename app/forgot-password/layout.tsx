import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Click&Pick UK",
  description:
    "Reset your Click&Pick UK account password securely using your email verification OTP.",
  alternates: {
    canonical: "https://clickpick.uk/forgot-password",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
};

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}