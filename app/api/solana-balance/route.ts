import { NextRequest, NextResponse } from 'next/server';

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet.solana.com';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 });
  }

  try {
    const [solRes, splRes, spl2022Res] = await Promise.all([
      fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address],
        }),
      }).then((r) => r.json()),
      fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenAccountsByOwner',
          params: [
            address,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' },
          ],
        }),
      }).then((r) => r.json()),
      fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'getTokenAccountsByOwner',
          params: [
            address,
            { programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' },
            { encoding: 'jsonParsed' },
          ],
        }),
      }).then((r) => r.json()),
    ]);

    const lamports = solRes?.result?.value ?? 0;
    const solBalance = lamports / 1e9;

    const splBalances: Record<string, number> = {};
    const allAccounts = [
      ...(splRes?.result?.value ?? []),
      ...(spl2022Res?.result?.value ?? []),
    ];
    for (const account of allAccounts) {
      const info = account.account?.data?.parsed?.info;
      if (info?.mint && info?.tokenAmount?.uiAmount != null) {
        splBalances[info.mint] = info.tokenAmount.uiAmount;
      }
    }

    return NextResponse.json({ sol: solBalance, spl: splBalances });
  } catch (err) {
    console.error('[solana-balance] error:', err);
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 });
  }
}
