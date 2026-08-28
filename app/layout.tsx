import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer, Navbar } from "./chrome";
import { Cursor } from "./cursor";
import "./globals.css";

// Self-hosted rather than next/font/google: the build box cannot always reach
// fonts.googleapis.com, and a fallback-font build is a silent regression. Both
// files are the latin variable woff2 straight from Google Fonts (v24 / v38).
const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  variable: "--font-jetbrains-mono",
  weight: "400 700",
  display: "swap",
});

// Italic only — the flourish is the sole thing that uses Fraunces, and it is
// always italic. Loading the roman cut would ship a face nothing renders.
const fraunces = localFont({
  src: "./fonts/Fraunces-Italic.woff2",
  variable: "--font-fraunces",
  weight: "400 700",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kv — AI Engineer",
  description:
    "AI engineering work: retrieval systems, agent orchestration, evaluation, and inference infrastructure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Pinned, same as the gateway: light theme regardless of OS preference,
      // green accent, comfortable density. Remove data-theme to follow system.
      data-theme="light"
      data-accent="green"
      data-density="comfortable"
      className={`${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <Cursor />
      </body>
    </html>
  );
}
