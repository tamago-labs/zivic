"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useClient } from "@solana/react";
import { Wallet, ChevronDown } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { AppClient } from "../SolanaWalletProvider";
import { getGradient } from "@/lib/wallet";
import { WalletModal } from "./WalletModal";
import { ConnectedPopover } from "./ConnectedPopover";
import { CreditsModal } from "./CreditsModal";
import TokenStrip from "./TokenStrip";
import { usePathname } from "next/navigation";
import listData from "@/lib/data/rwa-v1-list.json";
import { usePrices } from "@/app/contexts/PriceContext";

const tokenMetaMap = new Map<string, { logo: string | null; name: string; symbol: string; rwaRank: number | null }>();
for (const asset of (listData as any).assets) {
  for (const token of asset.tokens ?? []) {
    if (!tokenMetaMap.has(token.symbol)) {
      tokenMetaMap.set(token.symbol, {
        logo: token.logo ?? null,
        name: token.name,
        symbol: token.symbol,
        rwaRank: asset.rwa_rank ?? null,
      });
    }
  }
}

const dataClient = generateClient<Schema>();

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/portfolio": "Your AI-Powered Portfolio",
  "/dashboard/explore": "Explore All Tokenized Stocks on Solana",
  "/dashboard/alerts": "Stay Notified",
};

export default function Topbar() {
  const pathname = usePathname();
  const { prices } = usePrices();
  const client = useClient<AppClient>();
  const connected = useConnectedWallet(client);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!connected) { setCredits(null); return; }
    const address = String(connected.account.address);
    void (async () => {
      try {
        const { data: profiles } = await dataClient.models.UserProfile.list({
          filter: { walletAddress: { eq: address } },
        });
        setCredits(profiles[0]?.credits ?? null);
      } catch { setCredits(null); }
    })();
  }, [connected, creditsModalOpen]);

  const address = connected ? String(connected.account.address) : null;
  const gradient = address ? getGradient(address) : null;

  const tokenMatch = pathname.match(/^\/dashboard\/token\/([^/]+)\/([^/]+)$/);
  const tokenSlug = tokenMatch?.[1];
  const tokenCryptoId = tokenMatch?.[2];
  const tokenData = (listData as any).assets.flatMap((a: any) =>
    (a.tokens ?? []).map((t: any) => ({ ...t, assetSlug: a.slug, rwaRank: a.rwa_rank ?? null }))
  ).find((t: any) => t.assetSlug === tokenSlug && String(t.crypto_id) === tokenCryptoId);
  const tokenPrice = tokenData ? prices.find((p) => p.token_symbol === tokenData.symbol) : undefined;

  return (
    <header className="h-14 border-b border-border3/50 bg-surface flex items-center justify-between px-6 pl-0 sticky top-0 z-10">
      {PAGE_TITLES[pathname] ? (
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-lg font-display font-semibold text-white/70 px-2 ml-5"
        >
          {PAGE_TITLES[pathname]}
        </motion.h1>
      ) : tokenData ? (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 px-2 ml-5"
        >
          {tokenData.logo ? (
            <img src={tokenData.logo} alt="" className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/40">
              {tokenData.symbol?.slice(0, 2)}
            </div>
          )}
          <span className="text-sm font-semibold text-white/90">{tokenData.symbol}</span>
          {tokenData.rwaRank != null && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">
              #{tokenData.rwaRank}
            </span>
          )}
          {tokenPrice?.price != null && (
            <span className="text-sm font-semibold text-white/80 ml-2">
              ${tokenPrice.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
          {tokenPrice?.percent_24h != null && (
            <span className={`text-[11px] font-medium ${tokenPrice.percent_24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {tokenPrice.percent_24h >= 0 ? "+" : ""}{tokenPrice.percent_24h.toFixed(2)}%
            </span>
          )}
        </motion.div>
      ) : (
        <TokenStrip />
      )}

      <div className="flex items-center gap-3 relative shrink-0 ml-2">
        <button
          onClick={() => setCreditsModalOpen(true)}
          className="text-[13px] flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-white/80 font-medium">{credits !== null ? credits.toLocaleString() : "—"}</span>
          <span className="text-white/30">credits</span>
        </button>

        {address ? (
          <button onClick={() => setPopoverOpen((v) => !v)} className="relative flex items-center gap-2">
            <div
              style={{ background: `linear-gradient(135deg, ${gradient?.from}, ${gradient?.to})` }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white/90">{address.slice(2, 4).toUpperCase()}</span>
            </div>
            <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${popoverOpen ? "rotate-180" : ""}`} />
          </button>
        ) : (
          <button
            onClick={() => setWalletModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" />
            Connect Wallet
          </button>
        )}

        <AnimatePresence>
          {popoverOpen && address && <ConnectedPopover address={address} />}
        </AnimatePresence>
      </div>

      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      <CreditsModal open={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} />
    </header>
  );
}
