import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
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
  title: "Kv — AI, Game Dev, Systems Engineering",
  description:
    "Kahfi Rahmada. Systems that think, play, and hold up under load.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Theme is pinned, not user-switchable: data-theme="light" sets
    // color-scheme: only light, so the page stays light even under a system
    // dark preference. Density is the comfortable step of the spacing scale.
    // Accent is omitted because green is the default ramp.
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
