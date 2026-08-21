import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const flourish = Fraunces({
  subsets: ["latin"],
  style: "italic",
  weight: "500",
  variable: "--font-flourish",
});

export const metadata: Metadata = {
  title: "Kv — Systems Engineer",
  description:
    "Systems engineering portfolio: infrastructure, automation, and observability.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-density="comfortable"
      className={`${mono.variable} ${flourish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
