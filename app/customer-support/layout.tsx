import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Support | Click&Pick UK",
  description:
    "Get instant help from Click&Pick UK's AI customer support assistant. Ask questions about products, orders, delivery, returns and more.",
  alternates: {
    canonical: "https://clickpick.uk/customer-support",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/customer-support",
    siteName: "Click&Pick",
    title: "Customer Support | Click&Pick UK",
    description:
      "Get instant help from Click&Pick UK's AI customer support assistant for products, orders, delivery and returns.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Support | Click&Pick UK",
    description:
      "Get instant help from Click&Pick UK's AI customer support assistant.",
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

export default function CustomerSupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}