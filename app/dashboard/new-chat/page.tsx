'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const prompts = [
  'Show me lower-risk alternatives to NVDAx',
  'I want more AI exposure with balanced risk',
  'Build a diversified $10K portfolio',
  'Why is NVDAx ranked above MSFTx?',
  'What changed in my ranking today?',
];

const messages = [
  { role: 'user', text: 'I want long-term AI exposure with moderate risk' },
  {
    role: 'assistant',
    text: 'Based on your balanced risk profile and AI preference, here are your top matches:',
    results: [
      { ticker: 'NVDAx', score: 94, reason: 'Strong match for growth + AI preference' },
      { ticker: 'MSFTx', score: 89, reason: 'Tech exposure, established company profile' },
      { ticker: 'GOOGLx', score: 86, reason: 'AI exposure with different risk profile' },
    ],
  },
];

export default function NewChat() {
  const [input, setInput] = useState('');

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-accent text-white'
                : 'bg-surface border border-border3/50'
            }`}>
              <p className="text-[14px]">{msg.text}</p>
              {'results' in msg && msg.results && (
                <div className="mt-3 space-y-2">
                  {msg.results.map((r) => (
                    <div key={r.ticker} className="bg-white/[0.03] border border-border3/50 rounded-lg p-3 flex items-center gap-3">
                      <span className="font-mono text-[13px] font-semibold w-14">{r.ticker}</span>
                      <span className="text-[12px] text-white/40 flex-1">{r.reason}</span>
                      <span className="text-[14px] font-bold font-mono text-accent2">{r.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prompt chips */}
      <div className="flex flex-wrap gap-2 py-3">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-[11px] text-white/40 border border-border3 rounded-full px-3 py-1.5 hover:border-accent/40 hover:text-white/60 transition-colors"
          >
            {p.length > 40 ? p.substring(0, 40) + '…' : p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-surface border border-border3 rounded-xl p-4 flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Zivic anything about the market…"
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/25 outline-none resize-none min-h-[60px]"
        />
        <button className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors shrink-0">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
