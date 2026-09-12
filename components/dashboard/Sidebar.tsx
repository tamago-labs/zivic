'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, PieChart, Compass, Bell, Newspaper, List } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'New Chat', icon: MessageSquare },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/dashboard/explore', label: 'Explore', icon: Compass },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/top-news', label: 'Top News', icon: Newspaper },
  { href: '/dashboard/chats', label: 'Chats', icon: List },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen border-r border-border3/50 bg-surface flex flex-col fixed left-0 top-0">
      <Link href="/" className="px-5 h-14 flex items-center gap-2 border-b border-border3/50 hover:bg-white/[0.02] transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zenblue to-zenpurple flex items-center justify-center">
          <span className="text-[18px] font-brand">Z</span>
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">Zivic</span>
      </Link>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-display font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-zenblue/25 via-accent/15 to-accent2/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              <span className={isActive ? 'text-white' : ''}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
