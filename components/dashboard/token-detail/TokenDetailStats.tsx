import type { Token } from "@/lib/types/token";
import type { PriceData } from "@/app/contexts/PriceContext";
import { formatNumber } from "@/lib/utils/format";
import StatCard from "../StatCard";
import CopyButton from "../CopyButton";

export default function TokenDetailStats({ token, price }: { token: Token; price: PriceData | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard label="Market Cap" value={formatNumber(price?.market_cap ?? null, "$")} />
      <StatCard label="Volume (24h)" value={formatNumber(price?.volume_24h ?? null, "$")} />
      <StatCard label="Crypto ID" value={String(token.crypto_id)} />
      <StatCard
        label="Mint"
        value={token.mint ? `${token.mint.slice(0, 6)}...${token.mint.slice(-4)}` : "—"}
        sub={token.decimals != null ? `${token.decimals} decimals` : undefined}
      />
    </div>
  );
}
