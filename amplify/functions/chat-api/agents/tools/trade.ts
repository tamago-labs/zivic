import { tool } from "@openai/agents";
import { z } from "zod";
import crypto from "crypto";

const OKX_API_KEY = process.env.OKX_API_KEY ?? "";
const OKX_SECRET_KEY = process.env.OKX_SECRET_KEY ?? "";
const OKX_PASSPHRASE = process.env.OKX_PASSPHRASE ?? "";

function okxSign(timestamp: string, method: string, requestPath: string, body = ""): string {
  const prehash = timestamp + method + requestPath + body;
  return crypto.createHmac("sha256", OKX_SECRET_KEY).update(prehash).digest("base64");
}

const KNOWN_MINTS: Record<string, { mint: string; decimals: number }> = {
  SOL: { mint: "11111111111111111111111111111111", decimals: 9 },
  USDC: { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  USDT: { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
  USDG: { mint: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH", decimals: 6 },
  AAPL: { mint: "Ao4fdE3cGRjx9BC1UPqohTHbL7jT53jQEN3Pq4yiZ7qx", decimals: 6 },
  TSLA: { mint: "3gFkku3Y2ibQ4yEnqnY6PkumWHGjYcN6bU8tUFpaHnXj", decimals: 6 },
  NVDA: { mint: "FtX88mHh5LM9FKLfXs2RdWDJcDwfGpGCgLBXwzkqEWKC", decimals: 6 },
  MSFT: { mint: "4pVVttJWyDzHUp3LaapEUD9d7kWXQvHZiemx7GAj8zGp", decimals: 6 },
  GOOGL: { mint: "H2EQaLkYqvg6q7viQkVzXg6PbFFpSXh1DkqHCmKnTBgp", decimals: 6 },
  AMZN: { mint: "Ck9tRRzM48SX7PgGApphKW1fwPwf4mQmBh2H6wY1WkTT", decimals: 6 },
  META: { mint: "8iB38VmbkxFz1dNW4WBWY1Hd8VeSBLuqJUJYeYE2xz5G", decimals: 6 },
};

export const getSwapRoute = tool({
  name: "get_swap_route",
  description: "Get the best swap route through OKX DEX Router for a given token pair and amount on Solana.",
  parameters: z.object({
    tokenIn: z.string().describe("Input token symbol (e.g. SOL, USDC, AAPL)"),
    tokenOut: z.string().describe("Output token symbol (e.g. SOL, USDC, TSLA)"),
    amount: z.number().describe("Amount of tokenIn to swap"),
  }),
  execute: async ({ tokenIn, tokenOut, amount }: { tokenIn: string; tokenOut: string; amount: number }) => {
    const fromSymbol = tokenIn.toUpperCase();
    const toSymbol = tokenOut.toUpperCase();

    const from = KNOWN_MINTS[fromSymbol];
    const to = KNOWN_MINTS[toSymbol];

    if (!from || !to) {
      return JSON.stringify({ error: `Unknown token: ${!from ? fromSymbol : toSymbol}` });
    }

    const rawAmount = Math.round(amount * Math.pow(10, from.decimals)).toString();

    const url = new URL("https://web3.okx.com/api/v6/dex/aggregator/quote");
    url.searchParams.set("chainIndex", "501");
    url.searchParams.set("amount", rawAmount);
    url.searchParams.set("fromTokenAddress", from.mint);
    url.searchParams.set("toTokenAddress", to.mint);

    const path = url.pathname + url.search;
    const timestamp = new Date().toISOString();
    const signature = okxSign(timestamp, "GET", path);

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "OK-ACCESS-KEY": OKX_API_KEY,
        "OK-ACCESS-SIGN": signature,
        "OK-ACCESS-PASSPHRASE": OKX_PASSPHRASE,
        "OK-ACCESS-TIMESTAMP": timestamp,
      },
    });

    if (!res.ok) {
      return JSON.stringify({ error: `OKX API HTTP ${res.status}` });
    }

    const json = await res.json();
    if (json.code !== "0") {
      return JSON.stringify({ error: json.msg || "OKX API error" });
    }

    const quote = json.data?.[0];
    if (!quote) {
      return JSON.stringify({ error: "No quote available for this pair" });
    }

    const fromAmount = Number(quote.fromTokenAmount) / Math.pow(10, from.decimals);
    const toAmount = Number(quote.toTokenAmount) / Math.pow(10, to.decimals);

    return JSON.stringify({
      tokenIn: fromSymbol,
      tokenOut: toSymbol,
      amountIn: fromAmount,
      estimatedOutput: toAmount,
      price: toAmount / fromAmount,
      priceImpact: quote.priceImpactPercent,
      route: quote.dexRouterList?.map((d: any) => d.dexProtocol?.dexName).filter(Boolean) ?? ["OKX DEX"],
      dexRouterList: quote.dexRouterList,
      quoteId: quote.quoteId,
    });
  },
});

export const prepareTrade = tool({
  name: "prepare_trade",
  description: "Prepare a trade summary for user review. Returns structured JSON for the frontend to execute. Does NOT execute the swap.",
  parameters: z.object({
    tokenIn: z.string().describe("Input token symbol"),
    tokenOut: z.string().describe("Output token symbol"),
    amountIn: z.number().describe("Amount to swap"),
  }),
  execute: async ({ tokenIn, tokenOut, amountIn }: { tokenIn: string; tokenOut: string; amountIn: number }) => {
    const fromSymbol = tokenIn.toUpperCase();
    const toSymbol = tokenOut.toUpperCase();

    const from = KNOWN_MINTS[fromSymbol];
    const to = KNOWN_MINTS[toSymbol];

    if (!from || !to) {
      return JSON.stringify({ error: `Unknown token: ${!from ? fromSymbol : toSymbol}` });
    }

    const rawAmount = Math.round(amountIn * Math.pow(10, from.decimals)).toString();

    const url = new URL("https://web3.okx.com/api/v6/dex/aggregator/quote");
    url.searchParams.set("chainIndex", "501");
    url.searchParams.set("amount", rawAmount);
    url.searchParams.set("fromTokenAddress", from.mint);
    url.searchParams.set("toTokenAddress", to.mint);

    const path = url.pathname + url.search;
    const timestamp = new Date().toISOString();
    const signature = okxSign(timestamp, "GET", path);

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "OK-ACCESS-KEY": OKX_API_KEY,
        "OK-ACCESS-SIGN": signature,
        "OK-ACCESS-PASSPHRASE": OKX_PASSPHRASE,
        "OK-ACCESS-TIMESTAMP": timestamp,
      },
    });

    if (!res.ok) {
      return JSON.stringify({ error: `OKX API HTTP ${res.status}` });
    }

    const json = await res.json();
    if (json.code !== "0") {
      return JSON.stringify({ error: json.msg || "OKX API error" });
    }

    const quote = json.data?.[0];
    if (!quote) {
      return JSON.stringify({ error: "No quote available for this pair" });
    }

    const toAmount = Number(quote.toTokenAmount) / Math.pow(10, to.decimals);

    return JSON.stringify({
      tokenIn: fromSymbol,
      tokenOut: toSymbol,
      amountIn,
      estimatedOutput: toAmount,
      price: toAmount / amountIn,
      priceImpact: quote.priceImpactPercent,
      route: quote.dexRouterList?.map((d: any) => d.dexProtocol?.dexName).filter(Boolean) ?? ["OKX DEX"],
    });
  },
});
