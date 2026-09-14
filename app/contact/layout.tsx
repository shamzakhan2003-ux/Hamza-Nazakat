import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Click&Pick UK",
  description:
    "Contact Click&Pick UK for questions about products, orders, delivery, returns and general enquiries. Get in touch with our customer support team.",
  alternates: {
    canonical: "https://clickpick.uk/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/contact",
    siteName: "Click&Pick",
    title: "Contact Us | Click&Pick UK",
    description:
      "Contact Click&Pick UK for product, order, delivery, return and general enquiries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Click&Pick UK",
    description:
      "Contact Click&Pick UK for product, order, delivery, return and general enquiries.",
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

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}