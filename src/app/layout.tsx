import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/site/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Christine Britton — Fluid Art, Resin Art & Creative Drawing Tutorials",
  description:
    "Fluid art, resin art, doodle drawing and creative tutorials from a lifelong artist on the West coast of Scotland. Explore acrylic pouring, dutch pours, posca art, polymer clay and more.",
  keywords: [
    "fluid art",
    "acrylic pouring",
    "resin art",
    "doodle art",
    "posca art",
    "polymer clay",
    "drawing tutorials",
    "Christine Britton",
  ],
  authors: [{ name: "Christine Britton" }],
  openGraph: {
    title: "Christine Britton — Fluid Art, Resin Art & Creative Drawing Tutorials",
    description:
      "Fluid art, resin art, doodle drawing and creative tutorials from a lifelong artist on the West coast of Scotland.",
    siteName: "Christine Britton",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christine Britton",
    description: "Fluid art, resin art & creative drawing tutorials",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
