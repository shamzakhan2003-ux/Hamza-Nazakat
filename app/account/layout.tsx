import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Click&Pick UK",
  description:
    "Manage your Click&Pick UK account, view your orders, check order status, and track your shipments.",
  alternates: {
    canonical: "https://clickpick.uk/account",
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

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}