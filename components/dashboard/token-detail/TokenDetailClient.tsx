"use client";

import type { Token, Asset } from "@/lib/types/token";
import type { PriceData } from "@/app/contexts/PriceContext";
import TokenDetailHeader from "./TokenDetailHeader";
import TokenDetailPrice from "./TokenDetailPrice";
import TokenDetailStats from "./TokenDetailStats";
import TokenDetailAbout from "./TokenDetailAbout";
import TokenDetailInfo from "./TokenDetailInfo";
import TokenDetailLinks from "./TokenDetailLinks";
import TokenDetailOther from "./TokenDetailOther";

function mockPrice(token: Token): PriceData {
  return {
    token_symbol: token.symbol,
    price: 100 + Math.random() * 900,
    percent_1h: (Math.random() - 0.5) * 5,
    percent_24h: (Math.random() - 0.5) * 10,
    percent_7d: (Math.random() - 0.5) * 20,
    percent_30d: (Math.random() - 0.5) * 40,
    market_cap: Math.floor(Math.random() * 1e9),
    volume_24h: Math.floor(Math.random() * 1e8),
  };
}

export default function TokenDetailClient({
  asset,
  token,
  description,
  otherTokens,
  prices,
}: {
  asset: Asset;
  token: Token;
  description: string | null;
  otherTokens: Token[];
  prices: PriceData[];
}) {
  const price = prices.find((p) => p.token_symbol === token.symbol) ?? mockPrice(token);

  return (
    <div className="space-y-6">
      <TokenDetailHeader token={token} asset={asset} />
      <TokenDetailPrice token={token} price={price} />
      <TokenDetailStats token={token} price={price} />
      <TokenDetailAbout asset={asset} description={description} />
      <TokenDetailInfo token={token} asset={asset} />
      <TokenDetailLinks token={token} />
      <TokenDetailOther asset={asset} otherTokens={otherTokens} prices={prices} />
    </div>
  );
}
