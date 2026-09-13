"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useWallets,
  useWalletStatus,
} from "@solana/kit-plugin-wallet/react";
import { useClient } from "@solana/react";
import { Wallet, Copy, Check, LogOut, ChevronDown, X } from "lucide-react";
import type { AppClient } from "./SolanaWalletProvider";

function truncate(address: string) {
  return `${address.slice(0, 5)}…${address.slice(-4)}`;
}

const GRADIENTS = [
  { from: "#3B82F6", to: "#6C5CE7" },  // zenblue → accent
  { from: "#6C5CE7", to: "#F97316" },  // accent → accent2
  { from: "#3B82F6", to: "#F97316" },  // zenblue → accent2
  { from: "#F97316", to: "#8B5CF6" },  // accent2 → zenpurple
  { from: "#8B5CF6", to: "#6C5CE7" },  // zenpurple → accent
];

function getGradient(address: string) {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

// ─── Wallet Connect Modal ────────────────────────────────────────────────────

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export function WalletModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const client = useClient<AppClient>();
  const wallets = useWallets(client);
  const connected = useConnectedWallet(client);
  const connect = useConnect(client);
  const disconnect = useDisconnect(client);
  const status = useWalletStatus(client);

  const address = connected ? String(connected.account.address) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-4 rounded-2xl border border-border3/50 bg-surface p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">Connect Wallet</h3>
              <p className="text-[13px] text-white/40 mt-1">
                Choose a wallet to connect to Zivic
              </p>
            </div>

            {connected ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border3/50 bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">
                    Connected
                  </p>
                  <p className="font-mono text-[14px] text-white/80">
                    {truncate(address!)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    void disconnect.dispatch();
                    onClose();
                  }}
                  disabled={status === "pending"}
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {wallets.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-[13px] text-white/40">
                      No wallets detected.
                    </p>
                    <p className="text-[12px] text-white/25 mt-1">
                      Install Phantom or another Solana wallet to continue.
                    </p>
                  </div>
                ) : (
                  wallets.map((wallet) => (
                    <button
                      key={wallet.name}
                      disabled={connect.isRunning || status === "pending"}
                      onClick={() => {
                        void connect.dispatch(wallet);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 rounded-xl border border-border3/50 bg-white/[0.02] px-4 py-3.5 text-[14px] text-white/70 hover:text-white hover:border-accent/40 hover:bg-accent/[0.04] transition-all disabled:opacity-50"
                    >
                      {wallet.icon ? (
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className="w-5 h-5 rounded"
                        />
                      ) : (
                        <Wallet className="w-5 h-5 text-white/30" />
                      )}
                      <span className="font-medium">{wallet.name}</span>
                      <span className="ml-auto text-[11px] text-accent">
                        Connect
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {connect.error && (
              <p className="mt-4 text-[12px] text-red-400 text-center">
                {connect.error instanceof Error
                  ? connect.error.message
                  : String(connect.error)}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Connected Popover ───────────────────────────────────────────────────────

const popover = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.95, y: -8 },
};

function ConnectedPopover({ address }: { address: string }) {
  const client = useClient<AppClient>();
  const disconnect = useDisconnect(client);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const gradient = getGradient(address);

  return (
    <motion.div
      variants={popover}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-border3/50 bg-surface shadow-2xl overflow-hidden z-20"
    >
      {/* Section 1 — Balance */}
      <div className="p-4 border-b border-border3/30">
        <div className="flex items-center gap-3">
          <div
            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <span className="text-[11px] font-bold text-white/90">
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[13px] text-white/80 truncate">
              {truncate(address)}
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">
              -- SOL ≈ $--
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 — Copy address */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-between px-4 py-3 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors"
      >
        <span>Copy address</span>
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-green-400"
            >
              <Check className="w-3.5 h-3.5" />
            </motion.div>
          ) : (
            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Copy className="w-3.5 h-3.5 text-white/25" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Section 3 — Disconnect */}
      <button
        onClick={() => void disconnect.dispatch()}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-red-400 hover:bg-red-500/5 transition-colors border-t border-border3/30"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Disconnect</span>
      </button>
    </motion.div>
  );
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

export default function Topbar() {
  const client = useClient<AppClient>();
  const connected = useConnectedWallet(client);
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const address = connected ? String(connected.account.address) : null;
  const gradient = address ? getGradient(address) : null;

  return (
    <header className="h-14 border-b border-border3/50 bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-[14px] font-semibold text-white/80">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3 relative">
        {address ? (
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className="relative flex items-center gap-2"
          >
            <div
              style={{ background: `linear-gradient(135deg, ${gradient?.from}, ${gradient?.to})` }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white/90">
                {address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <ChevronDown
              className={`w-3 h-3 text-white/30 transition-transform ${
                popoverOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" />
            Connect Wallet
          </button>
        )}

        <AnimatePresence>
          {popoverOpen && address && (
            <ConnectedPopover address={address} />
          )}
        </AnimatePresence>
      </div>

      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
}
