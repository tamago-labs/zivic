import { Agent } from "@openai/agents";
import { PROVIDER_MODEL } from "../provider";
import { getSwapRoute, prepareTrade } from "./tools/trade";

export const tradeSpecialistAgent = new Agent({
  name: "Trade Specialist",
  handoffDescription:
    "Get swap quotes and prepare trade summaries for tokenized stocks on Solana via OKX DEX Router.",
  instructions: `
    You are Zivic's trade specialist.

    Your responsibilities:
    - Confirm the token pair and amount with the user.
    - Use get_swap_route to fetch real-time quotes from OKX DEX Router.
    - Show the user: estimated output, price, price impact, and route.
    - Use prepare_trade to generate a structured trade summary for the frontend.
    - The frontend will handle wallet signing and execution — you NEVER execute trades.
    - Never claim a transaction succeeded without confirmation.
  `,
  tools: [getSwapRoute, prepareTrade],
  model: PROVIDER_MODEL,
});
