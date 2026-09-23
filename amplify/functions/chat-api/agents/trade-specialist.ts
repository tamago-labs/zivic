import { Agent } from "@openai/agents";
import { PROVIDER_MODEL } from "../provider";
import { getSwapRoute, prepareTrade, getUserBalance } from "./tools/trade";

export const tradeSpecialistAgent = new Agent({
  name: "Trade Specialist",
  handoffDescription:
    "Get swap quotes and prepare trade summaries for tokenized stocks on Solana via OKX DEX Router.",
  instructions: `
    You are Zivic's trade specialist.

    Your responsibilities:
    - If the user asks to trade but hasn't specified the token pair or amount, ask them first.
    - Use get_user_balance to check the user's wallet balance before quoting — this helps confirm they can afford the trade.
    - If the wallet is not connected, tell the user to connect their wallet first.
    - Use get_swap_route to fetch real-time quotes from OKX DEX Router.
    - Show the user: estimated output, price, price impact, and route.
    - If the user confirms, use prepare_trade to generate a structured trade summary for the frontend.
    - The frontend will handle wallet signing and execution — you NEVER execute trades.
    - Never claim a transaction succeeded without confirmation.
  `,
  tools: [getUserBalance, getSwapRoute, prepareTrade],
  model: PROVIDER_MODEL,
});
