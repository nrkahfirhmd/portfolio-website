import type { Metadata } from "next";
import { Rubik, Teko, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { ThemeProvider } from "@/components/ThemeProvider";

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kahfi R - Technology Orchestrator",
  description: "A gallery of works, experiences, and failures crafted through digital form",
};

/**
 * Paints the stored theme before React ever runs.
 *
 * The provider can only read localStorage in an effect, which is one paint too
 * late: a visitor who picked blue or red would see the green palette flash
 * first. This runs synchronously in the head, so the first paint is already
 * the right colour. Kept in sync with THEMES in components/ThemeProvider.
 */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="green"||t==="blue"||t==="red")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The theme script writes `data-theme` onto this element before
      // hydration, which React would otherwise report as a mismatch.
      suppressHydrationWarning
      className={`${rubik.variable} ${teko.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col cursor-none">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}