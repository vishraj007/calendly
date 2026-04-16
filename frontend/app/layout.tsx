import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Calendly — Easy Scheduling Ahead",
  description:
    "Calendly is the modern scheduling platform that makes finding time a breeze. Share your availability and let people book time with you.",
  keywords: ["scheduling", "booking", "calendar", "meetings", "availability"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}