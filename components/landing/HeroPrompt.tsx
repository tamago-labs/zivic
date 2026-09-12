'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const prompts = [
  'I want long-term AI exposure with moderate risk',
  'Show me lower-risk alternatives to NVDAx',
  'Build a diversified $10K portfolio',
  'Why is NVDAx ranked above MSFTx?',
];

const responses = [
  {
    score: 94,
    ticker: 'NVDAx',
    reason: 'Strong match for your growth + AI preference.',
  },
];

export default function HeroPrompt() {
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex] = useState(() => Math.floor(Math.random() * prompts.length));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim()) setSubmitted(true);
  };

  return (
    <div className="bg-surface border border-border3 rounded-2xl shadow-2xl glow-blue overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border3 bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="text-[12px] text-white/60 font-medium">Zivic AI</span>
      </div>

      <div className="p-5">
        <div className="bg-white/[0.03] border border-border3 rounded-xl p-4">
          <textarea
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setSubmitted(false); }}
            placeholder={prompts[placeholderIndex]}
            className="w-full bg-transparent text-[14px] text-white placeholder:text-white/25 outline-none resize-none min-h-[80px]"
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => { setInputValue(prompt); setSubmitted(false); }}
                className="text-[12px] text-white/40 border border-border3 rounded-lg px-3 py-1.5 hover:border-accent/40 hover:text-white/60 transition-colors truncate max-w-[220px]"
              >
                {prompt.length > 38 ? prompt.substring(0, 38) + '…' : prompt}
              </button>
            ))}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-mono text-accent2 font-bold">Score: {responses[0].score}/100</span>
              <span className="text-[14px] font-semibold">{responses[0].ticker}</span>
            </div>
            <p className="text-[13px] text-white/50">{responses[0].reason}</p>
          </div>
        )}

        <div className="flex justify-end mt-3">
          <button onClick={handleSubmit} className="h-9 px-4 rounded-lg bg-accent flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors">
            <Send className="w-4 h-4 text-white" />
            <span className="text-[13px] font-medium text-white">Ask Zivic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
