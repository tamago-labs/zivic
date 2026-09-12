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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center tracking-tight mb-10 max-w-lg mx-auto">
            Tokenized stocks are here. The interfaces aren&apos;t.
          </h2>
        </Section>

        <Section>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Generic */}
            <div className="bg-white/[0.02] border border-border3/50 rounded-xl p-6">
              <p className="text-[13px] text-warn2 font-semibold mb-4">Generic ranking — same for everyone</p>
              <div className="space-y-3">
                {[
                  { rank: '#1', ticker: 'NVDAx', name: 'NVIDIA' },
                  { rank: '#2', ticker: 'AAPLx', name: 'Apple' },
                  { rank: '#3', ticker: 'MSFTx', name: 'Microsoft' },
                  { rank: '#4', ticker: 'GOOGLx', name: 'Alphabet' },
                ].map((s) => (
                  <div key={s.ticker} className="flex items-center gap-3 text-[14px] text-white/40">
                    <span className="text-[12px] text-white/25 w-6">{s.rank}</span>
                    <span className="font-mono font-semibold text-white/60">{s.ticker}</span>
                    <span className="text-white/30">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
              <p className="text-[13px] text-accent2 font-semibold mb-4">Your ranking — based on your goals</p>
              <div className="space-y-3">
                {[
                  { rank: '#1', ticker: 'NVDAx', name: 'NVIDIA', score: 94 },
                  { rank: '#2', ticker: 'MSFTx', name: 'Microsoft', score: 89 },
                  { rank: '#3', ticker: 'GOOGLx', name: 'Alphabet', score: 86 },
                  { rank: '#4', ticker: 'METAx', name: 'Meta', score: 82 },
                ].map((s) => (
                  <div key={s.ticker} className="flex items-center gap-3 text-[14px]">
                    <span className="text-[12px] text-white/25 w-6">{s.rank}</span>
                    <span className="font-mono font-semibold text-white">{s.ticker}</span>
                    <span className="text-white/30">{s.name}</span>
                    <span className="ml-auto text-[12px] font-mono text-accent2">{s.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="text-center mt-12">
            <p className="text-xl text-white font-semibold">
              The market is shared. The experience should be personal.
            </p>
            <p className="text-[14px] text-white/40 mt-3 max-w-lg mx-auto">
              Zivic combines your goals and risk appetite with live market and RWA data to rank, filter, and explain the xStocks most relevant to you.
            </p>
          </div>
        </Section>
      </div>
    </section>
  );
}
