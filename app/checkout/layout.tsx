import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Click&Pick UK",
  description:
    "Complete your order securely at Click&Pick UK by entering your delivery details and placing your order.",

  alternates: {
    canonical: "https://clickpick.uk/checkout",
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

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}