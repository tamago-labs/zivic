import type { Metadata } from "next";
import { Space_Grotesk, Inter, Zen_Tokyo_Zoo } from "next/font/google";
import SolanaWalletProvider from "@/components/SolanaWalletProvider";
import ConfigureAmplify from "@/components/ConfigureAmplify";
import { PriceProvider } from "./contexts/PriceContext";
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
  title: "Zivic — One-Stop AI for Tokenized Stocks on Solana",
  description: "Your one-stop AI platform for tokenized stocks and pre-IPO markets on Solana. Discover xStocks, Ondo Stocks, and PreStocks with AI-powered research, comparison, and trading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${zenTokyoZen.variable}`}>
      <body className="font-sans">
        <ConfigureAmplify>
        <SolanaWalletProvider>
          <PriceProvider>{children}</PriceProvider>
        </SolanaWalletProvider>
        </ConfigureAmplify>
      </body>
    </html>
  );
}
