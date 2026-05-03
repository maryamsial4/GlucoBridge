import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleUrdu?: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, titleUrdu, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <div className="w-full max-w-[430px] h-full" onClick={(e) => e.stopPropagation()} />
          </motion.div>
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-[40px] z-[60] overflow-hidden flex flex-col shadow-2xl"
            style={{ maxHeight: '85vh' }}
          >
            <div className="p-4 flex flex-col items-center gap-2 border-b border-slate-100">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-2 cursor-pointer" onClick={onClose} />
              <div className="w-full flex justify-between items-center px-4">
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
                <div className="text-right">
                  <h3 className="font-urdu font-bold text-lg text-slate-800">{titleUrdu}</h3>
                  {title && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{title}</p>}
                </div>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto no-scrollbar pb-12">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
