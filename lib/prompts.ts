export interface PromptItem {
  text: string;
  badge: string;
  color: string;
}

export const examplePrompts: PromptItem[] = [
  { text: 'I want long-term AI exposure with moderate risk', badge: '🔥 1st Popular', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { text: 'Show me lower-risk alternatives to NVDAx', badge: '📈 2nd Popular', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { text: 'Build a diversified $10K portfolio', badge: "Today's Most Hit", color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  { text: 'Why is NVDAx ranked above MSFTx?', badge: '🏆 All Time', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
];

export function getRandomPrompt(currentIndex: number): number {
  let next = Math.floor(Math.random() * examplePrompts.length);
  while (next === currentIndex && examplePrompts.length > 1) {
    next = Math.floor(Math.random() * examplePrompts.length);
  }
  return next;
}
