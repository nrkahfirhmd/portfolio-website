import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Fraunces, Syne } from "next/font/google";
import { HOME } from "@/content/site";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const brand = Syne({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["600", "700"],
});

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

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-density="comfortable"
      suppressHydrationWarning
      className={`${sans.variable} ${brand.variable} ${mono.variable} ${flourish.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
