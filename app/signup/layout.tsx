import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Click&Pick UK",
  description:
    "Create your Click&Pick UK customer account to manage orders, receive order updates and enjoy a convenient online shopping experience.",
  alternates: {
    canonical: "https://clickpick.uk/signup",
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

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}