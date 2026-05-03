import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { db, ChatMessage } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { cn } from '../lib/utils';
import { getTriage } from '../utils/triage';

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing. Please configure it in AI Studio Secrets.');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_PROMPT = `You are GlucoBridge Assistant, a friendly diabetes health guide for Pakistani patients. 
Rules: 
1) Answer ONLY diabetes-related questions. 
2) Respond in simple Urdu mixed with English medical terms. 
3) Keep answers under 4 sentences. 
4) Never diagnose. 
5) For serious symptoms, always say 'ڈاکٹر سے فوری ملیں'. 
6) Be warm and encouraging. 
7) DO NOT say 'Welcome' or 'Kushamuddin' in every text. ONLY greet the user if it's the very first message.
8) If user sends a number, interpret it as a glucose reading and give triage advice.`;

const QUICK_QUESTIONS = [
  "شوگر کیا ہے؟", 
  "کیا کھائیں؟", 
  "دوائی کب لیں؟", 
  "ورزش کریں؟", 
  "ڈاکٹر کب ملیں؟", 
  "رمضان میں کیا کریں؟"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatHistory = useLiveQuery(() => db.chatHistory.toArray()) || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      message: text,
      timestamp: Date.now()
    };

    await db.chatHistory.add(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const ai = getAI();
      // Basic triage check for numbers
      const numMatch = text.match(/\d+/);
      let dynamicContext = "";
      if (numMatch) {
        const val = parseInt(numMatch[0]);
        if (val > 20 && val < 600) {
          const triage = getTriage(val);
          dynamicContext = `\n[User just shared a reading of ${val}. Triage says: ${triage.label} - ${triage.urduMessage}]`;
        }
      }

      // Ensure alternating roles and limit history to last 8 messages
      // This prevents the API from failing due to non-alternating roles or exceeding context
      const formattedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      let lastRole: 'user' | 'model' | null = null;

      // Filter and pick last few valid messages
      const recentHistory = chatHistory.slice(-10);
      
      for (const h of recentHistory) {
        const role = h.role === 'assistant' ? 'model' : 'user';
        if (role !== lastRole) {
          formattedHistory.push({
            role,
            parts: [{ text: h.message }]
          });
          lastRole = role;
        }
      }

      // If the last message in history is 'user', we might have a conflict 
      // because we are about to add another 'user' message. 
      // So we make sure the history ends with 'model' or is empty.
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
        formattedHistory.pop();
      }

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...formattedHistory,
          { role: 'user', parts: [{ text: text + dynamicContext }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT
        }
      });
      
      const botText = result.text || "معذرت، ابھی رابطہ نہیں ہو پا رہا۔";

      await db.chatHistory.add({
        role: 'assistant',
        message: botText,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(error);
      await db.chatHistory.add({
        role: 'assistant',
        message: "معذرت، ابھی رابطہ نہیں ہو پا رہا۔ انٹرنیٹ چیک کریں۔",
        timestamp: Date.now()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-6 z-30">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-teal-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl border-4 border-white active:bg-teal-700 transition-colors"
          >
            💬
          </motion.button>
        </div>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[50]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[75vh] bg-white rounded-t-[40px] z-[60] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-urdu">GlucoBridge AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Always Online</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-8 px-12">
                    <Sparkles className="h-8 w-8 text-teal-400 mx-auto mb-3" />
                    <p className="font-urdu text-lg text-slate-500 leading-relaxed">
                      میں گلوکو برج اسسٹنٹ ہوں۔ آپ مجھ سے شوگر کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں۔
                    </p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-3xl text-sm font-urdu leading-relaxed shadow-sm",
                      msg.role === 'user' ? "bg-teal-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    )}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"></motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"></motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"></motion.span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-urdu font-bold hover:bg-teal-50 hover:text-teal-600 transition-colors border border-slate-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اپنا سوال پوچھیں..."
                    className="flex-grow p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-teal-100 font-urdu"
                  />
                  <button
                    onClick={() => handleSend()}
                    className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-700/20 active:scale-95 transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
