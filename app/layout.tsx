import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clickpick.uk"),

  title: {
    default: "Click&Pick | Online Shopping in the UK",
    template: "%s | Click&Pick",
  },

  description:
    "Shop online in the UK with Click&Pick. Explore electronics, home & kitchen, toys, beauty, fashion, sports and more at competitive prices with UK delivery.",

  applicationName: "Click&Pick",

  keywords: [
    "online shopping UK",
    "UK online store",
    "shop online UK",
    "electronics UK",
    "home and kitchen UK",
    "toys UK",
    "beauty products UK",
    "fashion UK",
    "sports products UK",
    "Click&Pick",
  ],

  alternates: {
    canonical: "https://clickpick.uk/",
  },

  icons: {
    icon: "/favicon.svg",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://clickpick.uk/",
    siteName: "Click&Pick",
    title: "Click&Pick | Online Shopping in the UK",
    description:
      "Shop online in the UK with Click&Pick. Explore electronics, home & kitchen, toys, beauty, fashion, sports and more at competitive prices with UK delivery.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Click&Pick | Online Shopping in the UK",
    description:
      "Shop online in the UK with Click&Pick. Explore electronics, home & kitchen, toys, beauty, fashion, sports and more.",
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

  category: "ecommerce",

  verification: {
    other: {
      "msvalidate.01": "B9E14579FBAE83DEAA81EE6511D457A5",
    },
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}