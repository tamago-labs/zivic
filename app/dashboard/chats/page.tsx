'use client';

const chats = [
  {
    title: 'AI exposure with balanced risk',
    date: 'Today',
    messages: 4,
    preview: 'Showed my top matches for AI-focused balanced portfolio…',
  },
  {
    title: 'Lower-risk alternatives',
    date: 'Yesterday',
    messages: 6,
    preview: 'Asked for alternatives to NVDAx with lower risk profile…',
  },
  {
    title: 'Diversified $10K portfolio',
    date: '2 days ago',
    messages: 3,
    preview: 'Built a simulated portfolio with balanced diversification…',
  },
  {
    title: 'xStock rankings this week',
    date: '3 days ago',
    messages: 5,
    preview: 'Why did NVDAx move above MSFTx in my ranking…',
  },
  {
    title: 'Technology sector deep dive',
    date: '1 week ago',
    messages: 8,
    preview: 'Explored all tech xStocks and their HyperGO scores…',
  },
];

export default function Chats() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold">Chat History</h2>
        <span className="text-[12px] text-white/30">{chats.length} conversations</span>
      </div>

      <div className="space-y-2">
        {chats.map((chat, i) => (
          <div key={i} className="bg-surface border border-border3/50 rounded-xl p-4 hover:border-border3 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[14px] font-medium text-white/80">{chat.title}</h3>
              <span className="text-[11px] text-white/25 ml-auto">{chat.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/25">{chat.messages} messages</span>
              <span className="text-[11px] text-white/15">·</span>
              <span className="text-[12px] text-white/40 truncate">{chat.preview}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
