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
  title: "Lumen Journal — Stories, ideas & thoughtful living",
  description:
    "An independent editorial magazine exploring wellness, home, travel, food and culture. Thoughtful writing for curious minds.",
  keywords: [
    "lifestyle magazine",
    "wellness",
    "slow living",
    "home",
    "travel",
    "food",
    "culture",
    "editorial blog",
  ],
  authors: [{ name: "Lumen Journal" }],
  openGraph: {
    title: "Lumen Journal — Stories, ideas & thoughtful living",
    description:
      "An independent editorial magazine exploring wellness, home, travel, food and culture.",
    siteName: "Lumen Journal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen Journal",
    description: "Stories, ideas & thoughtful living",
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
