import type { Metadata } from "next";
import { Space_Grotesk, Inter, Zen_Tokyo_Zoo } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const zenTokyoZen = Zen_Tokyo_Zoo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Zivic — Hyper-Personalized AI Dashboard for Tokenized Stocks",
  description: "Zivic is a hyper-personalized AI dashboard for tokenized stocks on X Layer. Tell Zivic your goals and risk appetite — it ranks, filters, and explains the xStocks that matter most to you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${zenTokyoZen.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
