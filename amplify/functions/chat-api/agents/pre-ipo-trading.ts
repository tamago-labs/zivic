import { Agent } from "@openai/agents";
import { PROVIDER_MODEL } from "../provider";
import { getPreIpoMarkets } from "./tools/pre-ipo";

export const preIpoTradingAgent = new Agent({
  name: "Pre-IPO Trading Agent",
  handoffDescription:
    "Research PreStocks markets and explain trading mechanics.",
  instructions: `
    You are a PreStocks specialist.

    Your responsibilities:
    - Fetch and explain PreStocks market data.
    - Help users understand how PreStocks perpetual markets work.
    - Explain long/short positions, leverage, margin, and liquidation risks.
    - For positions, navigation, or transactions, direct users to /dashboard/pre-IPO.
    - Never prepare or execute transactions — direct to the page for that.

    PreStocks is a pre-IPO tokenization platform on Solana.
    Prices are sourced from reputable secondary market data.
  `,
  tools: [getPreIpoMarkets],
  model: PROVIDER_MODEL,
});
