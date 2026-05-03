import { Flame } from 'lucide-react';
import { motion } from 'motion/react';

export default function StreakBanner({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mx-5 mb-6 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden"
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className="text-2xl animate-bounce">🔥</div>
        <div>
          <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Consistency Streak</p>
          <p className="text-lg font-bold">{streak} Days Strong!</p>
        </div>
      </div>
      
      <div className="text-right flex flex-col items-end z-10" dir="rtl">
          <p className="text-2xl font-bold font-mono">{streak} دن</p>
          <p className="text-[10px] font-urdu opacity-90 leading-none">مسلسل برقراری</p>
      </div>

      {/* Decorative inner glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
    </motion.div>
  );
}
