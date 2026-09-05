import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Click&Pick",
  description: "Click&Pick - Online Store in the United Kingdom",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
