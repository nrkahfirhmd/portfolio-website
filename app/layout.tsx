import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import { HOME } from "@/content/site";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const flourish = Fraunces({
  variable: "--font-flourish",
  subsets: ["latin"],
  style: "italic",
  weight: "500",
});

export const metadata: Metadata = {
  title: HOME.title,
  description: HOME.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Light theme pinned (even under a dark OS), comfortable density; green is the default accent.
    <html
      lang="en"
      data-theme="light"
      data-density="comfortable"
      className={`${mono.variable} ${flourish.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
