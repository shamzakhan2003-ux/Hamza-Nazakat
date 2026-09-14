import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Click&Pick UK",
  description:
    "Review your selected products and proceed to checkout at Click&Pick UK.",

  alternates: {
    canonical: "https://clickpick.uk/cart",
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

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}