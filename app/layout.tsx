import type { Metadata } from "next";
import { Manrope, Sora, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displayFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // title: "Danger Dance Academy Baranagar",
  title:"Demo",
  description:
    "Premium dance academy landing page for Danger Dance Academy in Baranagar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", bodyFont.variable, displayFont.variable, "font-sans", geist.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
