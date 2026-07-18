import type { Metadata } from "next";
import { Rubik, Teko } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kahfi's Portfolio",
  description: "A gallery of works, experiences, and failures crafted through digital form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rubik.variable} ${teko.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col cursor-none">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}