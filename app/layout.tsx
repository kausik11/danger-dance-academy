import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "600",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Danger Dance Academy Baranagar",
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
      className={cn("h-full", "antialiased", roboto.variable, "font-sans")}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
