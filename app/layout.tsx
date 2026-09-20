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
  title: "Zivic — AI Risk Engine for Tokenized Equities on Solana",
  description: "Zivic’s AI Risk Engine turns tokenized equities on Solana into productive assets. Research, risk analysis, collateral readiness, and smart routing for xStocks, Ondo Stocks, and PreStocks — all in one place.",
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
