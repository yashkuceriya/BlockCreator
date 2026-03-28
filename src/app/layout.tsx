import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Editorial Engine | AI-Powered WordPress Block Theme Generator",
    template: "%s | The Editorial Engine",
  },
  description:
    "Generate production-ready WordPress block themes from natural language descriptions. Complete with theme.json, FSE templates, patterns, and style variations — powered by Claude AI. Zero custom HTML blocks.",
  keywords: [
    "WordPress",
    "block theme",
    "theme generator",
    "AI",
    "Full Site Editing",
    "FSE",
    "theme.json",
    "WordPress Playground",
    "Claude AI",
    "Gutenberg",
  ],
  authors: [{ name: "The Editorial Engine" }],
  creator: "The Editorial Engine",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Editorial Engine",
    title: "The Editorial Engine — AI-Powered WordPress Block Themes",
    description:
      "Describe your vision, get a production-ready WordPress block theme. Complete with theme.json, templates, patterns, and live preview.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Editorial Engine — AI WordPress Theme Generator",
    description:
      "Generate production-ready WordPress block themes from natural language. Powered by Claude AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#176491",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[var(--color-bg-page)]">{children}</body>
    </html>
  );
}
