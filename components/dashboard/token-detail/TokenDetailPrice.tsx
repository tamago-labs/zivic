"use client";

import type { Token } from "@/lib/types/token";
import type { PriceData } from "@/app/contexts/PriceContext";
import MockChart from "../MockChart";

export default function TokenDetailPrice({ token, price }: { token: Token; price: PriceData | undefined }) {
  const isPositive = (price?.percent_24h ?? 0) >= 0;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
      <MockChart positive={isPositive} />
    </div>
  );
}
