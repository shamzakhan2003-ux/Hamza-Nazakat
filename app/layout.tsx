import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AM Whole Sale Pakistan",
  description: "AM Whole Sale Pakistan - Online Store",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
