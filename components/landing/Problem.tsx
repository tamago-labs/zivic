'use client';

import Section from './Section';

export default function Problem() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Section>
          <p className="text-[13px] text-accent uppercase tracking-wider text-center mb-6">The problem</p>
        </Section>

        <Section>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center tracking-tight max-w-lg mx-auto">
            Why tokenized stocks belong on-chain
          </h2>
        </Section>

        <Section>
          <p className="mt-6 text-[15px] text-white/50 leading-relaxed text-center max-w-2xl mx-auto">
            Tokenized stocks don&apos;t have to live inside a single platform. Onchain markets give users a new way to hold, transfer, and interact with tokenized equities.
          </p>
        </Section>

        <Section>
          <div className="mt-12 max-w-3xl mx-auto">
            {/* Desktop table */}
            <div className="hidden md:block border border-border3/50 rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border3/50 bg-white/[0.02]">
                    <th className="text-left px-6 py-4 text-white/50 font-medium">Capability</th>
                    <th className="text-left px-6 py-4 text-white/50 font-medium">CEX / Traditional</th>
                    <th className="text-left px-6 py-4 text-accent2 font-medium">Onchain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border3/50">
                  <tr>
                    <td className="px-6 py-4 text-white/70 font-medium">Access</td>
                    <td className="px-6 py-4 text-white/40">Platform account and eligibility requirements.</td>
                    <td className="px-6 py-4 text-white/60"><span className="font-semibold text-white/80">Permissionless interaction</span> with supported onchain markets.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-white/70 font-medium">Ownership</td>
                    <td className="px-6 py-4 text-white/40">Held within the platform&apos;s account or custody model.</td>
                    <td className="px-6 py-4 text-white/60"><span className="font-semibold text-white/80">Wallet-native</span> assets you can hold and transfer through supported networks.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-white/70 font-medium">Composability</td>
                    <td className="px-6 py-4 text-white/40">Limited to the platform&apos;s supported features and integrations.</td>
                    <td className="px-6 py-4 text-white/60"><span className="font-semibold text-white/80">Connect to DeFi, lending, and other onchain applications</span> where supported.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-white/70 font-medium">Transferability</td>
                    <td className="px-6 py-4 text-white/40">Transfers depend on the platform&apos;s supported workflows.</td>
                    <td className="px-6 py-4 text-white/60"><span className="font-semibold text-white/80">Transfer</span> between compatible wallets and applications.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {[
                { cap: 'Access', cex: 'Platform account and eligibility requirements.', onchain: 'Permissionless interaction with supported onchain markets.' },
                { cap: 'Ownership', cex: 'Held within the platform\'s account or custody model.', onchain: 'Wallet-native assets you can hold and transfer through supported networks.' },
                { cap: 'Composability', cex: 'Limited to the platform\'s supported features and integrations.', onchain: 'Connect to DeFi, lending, and other onchain applications where supported.' },
                { cap: 'Transferability', cex: 'Transfers depend on the platform\'s supported workflows.', onchain: 'Transfer between compatible wallets and applications.' },
              ].map((row) => (
                <div key={row.cap} className="border border-border3/50 rounded-xl p-4 bg-white/[0.02]">
                  <p className="text-[13px] text-white/70 font-medium mb-3">{row.cap}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">CEX / Traditional</p>
                      <p className="text-[12px] text-white/40">{row.cex}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-accent2 uppercase tracking-wider mb-1">Onchain</p>
                      <p className="text-[12px] text-white/60">{row.onchain}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-white/30 leading-relaxed text-center">
              <span className="text-white/40 font-medium">Important:</span> <span className="text-accent">&ldquo;Permissionless&rdquo;</span> describes the ability to interact with supported onchain contracts or markets without a traditional platform account. It does not mean every tokenized stock can be acquired by anyone, or that issuer, transfer, KYC, or geographic restrictions disappear.
            </p>
          </div>
        </Section>
      </div>
    </section>
  );
}
