import { useState, useEffect } from 'react';
import { db, Patient } from './utils/db';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import History from './pages/History';
import Awareness from './pages/Awareness';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import ChatBot from './components/ChatBot';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatient() {
      const data = await db.patients.toArray();
      if (data.length > 0) {
        setPatient(data[0]);
      }
      setLoading(false);
    }
    loadPatient();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!patient) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home patient={patient} />;
      case 'history': return <History />;
      case 'awareness': return <Awareness />;
      case 'profile': return <Profile patient={patient} />;
      default: return <Home patient={patient} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen flex flex-col relative shadow-2xl pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-grow overflow-x-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        <ChatBot />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
