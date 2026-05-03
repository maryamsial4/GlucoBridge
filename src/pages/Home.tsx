import { useLiveQuery } from 'dexie-react-hooks';
import { db, Patient } from '../utils/db';
import Header from '../components/Header';
import QuickLog from '../components/QuickLog';
import StreakBanner from '../components/StreakBanner';
import { getTriage } from '../utils/triage';
import { cn } from '../lib/utils';
import { Activity, Target, Calendar, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

const HEALTH_TIPS = [
  "کھانے کے بعد 15 منٹ ضرور چلیں۔",
  "روزانہ کم از کم 8 گلاس پانی پئیں۔",
  "اپنی ادویات کا وقت مقرر کریں۔",
  "چینی اور میٹھی چیزوں سے پرہیز کریں۔",
  "پھلوں کا استعمال اعتدال میں کریں۔",
  "پاؤں کی باقاعدگی سے صفائی اور معائنہ کریں۔"
];

export default function Home({ patient }: { patient: Patient }) {
  const readings = useLiveQuery(() => db.readings.orderBy('timestamp').reverse().toArray());

  const calculateStreak = () => {
    if (!readings || readings.length === 0) return 0;
    
    const dates = new Set(readings.map(r => new Date(r.timestamp).toDateString()));
    let streak = 0;
    let current = new Date();
    
    while (dates.has(current.toDateString())) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  };

  const streak = calculateStreak();
  const lastReading = readings?.[0];
  const weeklyAverage = readings 
    ? Math.round(readings.slice(0, 7).reduce((acc, r) => acc + r.value, 0) / Math.min(readings.length, 7)) || 0
    : 0;
  
  const inTargetCount = readings?.filter(r => r.value >= 70 && r.value <= 140).length || 0;
  const inTargetPercent = readings ? Math.round((inTargetCount / readings.length) * 100) || 0 : 0;

  const tipOfTheDay = HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length];

  return (
    <div className="pb-8">
      <Header patient={patient} />
      
      <QuickLog onLog={() => {}} />

      <StreakBanner streak={streak} />

      {/* Stats Row */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Last</span>
          <span className="text-lg font-mono font-extrabold text-slate-700 leading-none">{lastReading?.value || '--'}</span>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Weekly Avg</span>
          <span className="text-lg font-mono font-extrabold text-teal-600 leading-none">{weeklyAverage}</span>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Target %</span>
          <span className="text-lg font-mono font-extrabold text-green-600 leading-none">{inTargetPercent}%</span>
        </div>
      </div>

      {/* Recent Readings */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm">Recent Readings</h3>
          <button className="text-teal-600 text-xs font-bold flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {readings?.slice(0, 2).map((r) => {
            const tr = getTriage(r.value);
            return (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold", tr.color)}>
                    {r.value}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{tr.label}</div>
                    <div className="text-[10px] text-slate-400">{new Date(r.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-urdu text-xs text-slate-500">{tr.urduMessage.split('!')[0]}</span>
                </div>
              </div>
            );
          })}
          {(!readings || readings.length === 0) && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
              No readings yet. Log your first one above!
            </div>
          )}
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="px-5 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3 shadow-sm border-y border-r border-slate-100">
          <div className="text-2xl pt-1">💡</div>
          <div className="text-right flex-1" dir="rtl">
            <p className="text-blue-900 font-bold text-[10px] mb-1 uppercase tracking-tighter">آج کا مشورہ (Tip of the Day)</p>
            <p className="text-blue-800 text-sm leading-relaxed font-urdu font-bold">
              {tipOfTheDay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
