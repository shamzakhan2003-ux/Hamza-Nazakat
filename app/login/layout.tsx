import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Click&Pick UK",
  description:
    "Sign in to your Click&Pick UK account to manage your orders, track deliveries and access your customer account.",
  alternates: {
    canonical: "https://clickpick.uk/login",
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

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}