import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getTriage, TriageEntry } from '../utils/triage';
import { db } from '../utils/db';
import { cn } from '../lib/utils';
import { Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export default function QuickLog({ onLog }: { onLog: () => void }) {
  const [value, setValue] = useState<string>('');
  const [triage, setTriage] = useState<TriageEntry | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async () => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) return;

    const result = getTriage(numValue);
    setTriage(result);

    await db.readings.add({
      value: numValue,
      triageStatus: result.label,
      urduMessage: result.urduMessage,
      timestamp: Date.now(),
      type: 'fasting'
    });

    setIsSaved(true);
    setValue('');
    onLog();

    setTimeout(() => {
      setIsSaved(false);
      setTriage(null);
    }, 10000);
  };

  return (
    <div className="mx-5 -mt-8 mb-6 sleek-card p-5 relative z-10 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Fasting Glucose</span>
        <span className="text-slate-500 font-urdu text-[11px]" dir="rtl">خالی پیٹ گلوکوز</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-3 py-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="000"
            className="w-32 text-center text-5xl font-mono font-bold text-slate-800 focus:ring-0 outline-none placeholder:text-slate-100"
          />
          <div className="flex flex-col">
            <span className="text-teal-600 font-bold text-sm">mg/dL</span>
            <span className="h-1 w-8 bg-teal-500 rounded-full"></span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!value || isSaved}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95",
            isSaved ? "bg-green-500 text-white" : "bg-teal-600 text-white"
          )}
        >
          {isSaved ? 'Reading Saved' : 'Save Reading'}
        </button>
      </div>

      <AnimatePresence>
        {triage && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "rounded-xl p-3 border flex items-center gap-4 transition-colors",
              triage.color.replace('bg-', 'bg-') + '/10',
              triage.color.replace('bg-', 'border-').replace('600', '200').replace('500', '200')
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shrink-0 shadow-sm",
                triage.color
              )}>
                {triage.status === 'excellent' || triage.status === 'normal' ? '✅' : triage.icon}
              </div>
              <div className="flex-1 text-right" dir="rtl">
                <p className={cn("font-bold font-urdu leading-none mb-1", 
                  triage.status === 'excellent' || triage.status === 'normal' ? 'text-green-800' : 'text-slate-800'
                )}>
                  {triage.label === 'Normal' ? 'نارمل ریڈنگ' : triage.label}
                </p>
                <p className={cn("font-urdu text-[11px] leading-relaxed",
                   triage.status === 'excellent' || triage.status === 'normal' ? 'text-green-700' : 'text-slate-600'
                )}>
                  {triage.urduMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
