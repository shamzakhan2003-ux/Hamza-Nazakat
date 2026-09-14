import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds | Click&Pick UK",
  description:
    "Learn about Click&Pick UK returns and refunds, including eligibility, refund requests, unboxing video requirements and refund processing times.",
  alternates: {
    canonical: "https://clickpick.uk/returns",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/returns",
    siteName: "Click&Pick",
    title: "Returns & Refunds | Click&Pick UK",
    description:
      "Learn about Click&Pick UK returns, refund eligibility, refund requests and processing times.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Returns & Refunds | Click&Pick UK",
    description:
      "Learn about Click&Pick UK returns, refund requests and refund processing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function ReturnsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}