import { Home, History, Lightbulb, User } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'home' | 'history' | 'awareness' | 'profile';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'HOME', labelUrdu: 'ہوم', Icon: '🏠' },
    { id: 'history', label: 'HISTORY', labelUrdu: 'تاریخ', Icon: '📊' },
    { id: 'awareness', label: 'LEARN', labelUrdu: 'آگاہی', Icon: '🧠' },
    { id: 'profile', label: 'PROFILE', labelUrdu: 'پروفائل', Icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-slate-200 h-20 flex items-center justify-around px-2 z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as Tab)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === tab.id ? "text-teal-600" : "text-slate-400"
          )}
        >
          <span className={cn("text-xl transition-transform", activeTab === tab.id ? "font-bold scale-110" : "opacity-80")}>
            {tab.Icon}
          </span>
          <span className="text-[10px] font-extrabold tracking-tighter opacity-90">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
