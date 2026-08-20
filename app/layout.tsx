import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { Footer, Navbar } from "./chrome";
import { Cursor } from "./cursor";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Italic only — the flourish is the sole thing that uses Fraunces, and it is
// always italic. Loading the roman cut would ship a face nothing renders.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "italic",
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
