import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Click&Pick UK",
  description:
    "Track your Click&Pick UK order and check the latest delivery status, courier information, tracking number and delivery progress.",
  alternates: {
    canonical: "https://clickpick.uk/track-order",
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

export default function TrackOrderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}