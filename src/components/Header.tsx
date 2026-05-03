import { Bell } from 'lucide-react';
import { Patient } from '../utils/db';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({ patient }: { patient: Patient }) {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="gradient-header px-6 pt-8 pb-12 text-white rounded-b-[40px] shadow-lg relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
            <span className="text-xl">🩸</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight">GlucoBridge</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotification(!showNotification)}
            className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 active:scale-95 transition-transform"
          >
            <Bell className="h-5 w-5 opacity-90" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-teal-700"></span>
          </button>
          
          <AnimatePresence>
            {showNotification && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotification(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-2xl p-4 text-slate-800 z-50 border border-slate-100"
                >
                  <div className="text-right" dir="rtl">
                    <h4 className="font-bold text-sm mb-1 font-urdu">اطلاعات (Notifications)</h4>
                    <p className="text-xs text-slate-500 font-urdu">ابھی کوئی نئی اطلاع نہیں ہے۔</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-teal-100 text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">Assalam-o-Alaikum,</p>
          <p className="text-xl font-bold tracking-tight">{patient.name}</p>
        </div>
        <div className="text-right" dir="rtl">
          <p className="text-teal-100 text-sm font-urdu leading-none opacity-80 mb-1">السلام علیکم،</p>
          <p className="text-2xl font-urdu leading-none font-bold tracking-tighter">{patient.name}</p>
        </div>
      </div>
    </header>
  );
}
