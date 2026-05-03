import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../utils/db';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { Check, ChevronRight, MapPin, User, Stethoscope, Phone } from 'lucide-react';

const steps = [
  { id: 1, title: 'Language', titleUrdu: 'زبان' },
  { id: 2, title: 'Basic Info', titleUrdu: 'بنیادی معلومات' },
  { id: 3, title: 'Demographics', titleUrdu: 'آپ کی عمر' },
  { id: 4, title: 'Diabetes Type', titleUrdu: 'شوگر کی قسم' },
  { id: 5, title: 'Medications', titleUrdu: 'ادویات' },
  { id: 6, title: 'Emergency', titleUrdu: 'ہنگامی رابطہ' },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language: 'ur' as 'en' | 'ur',
    name: '',
    age: 45,
    gender: 'male',
    city: 'Faisalabad',
    diabetesType: 'Type 2',
    medications: [] as string[],
    emergencyContact: '',
    reminderTime: '08:00',
  });

  const nextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    await db.patients.add({
      ...formData,
      createdAt: Date.now(),
      onboardingCompleted: true,
    });
    
    setTimeout(onComplete, 1500);
  };

  const cities = ['RYK', 'Lahore', 'Karachi', 'Multan', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];
  const diabetesTypes = ['Type 1', 'Type 2', 'Gestational', 'Pre-diabetes'];
  const meds = ['Metformin', 'Insulin', 'Sulfonylureas', 'None'];

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center p-6 pb-24">
      {/* Progress Bar */}
      <div className="w-full max-w-md bg-teal-200 h-1.5 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="bg-teal-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex-grow flex flex-col"
        >
          {/* Step 1: Language */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-teal-800 mb-2 font-urdu">خوش آمدید</h1>
                <p className="text-slate-600">Choose your preferred language</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, language: 'ur' })}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all flex justify-between items-center",
                    formData.language === 'ur' ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200" : "border-slate-100"
                  )}
                >
                  <span className="text-xl font-urdu">اردو</span>
                  {formData.language === 'ur' && <Check className="text-teal-600" />}
                </button>
                <button
                  onClick={() => setFormData({ ...formData, language: 'en' })}
                  className={cn(
                    "p-6 rounded-2xl border-2 transition-all flex justify-between items-center",
                    formData.language === 'en' ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200" : "border-slate-100"
                  )}
                >
                  <span className="text-xl">English</span>
                  {formData.language === 'en' && <Check className="text-teal-600" />}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold font-urdu mb-2">آپ کا نام؟</h2>
                <p className="text-slate-500 font-urdu">اپنا نام یہاں لکھیں</p>
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={formData.language === 'ur' ? "نام لکھیں" : "Enter your name"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 3: Demographics */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold font-urdu mb-2">آپ کی عمر اور شہر؟</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-500 ml-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-500 ml-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none appearance-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-12 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <label className="block text-sm font-medium text-slate-500 ml-2 mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none appearance-none"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Diabetes Type */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold font-urdu mb-2">شوگر کی کون سی قسم ہے؟</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {diabetesTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, diabetesType: type })}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center",
                      formData.diabetesType === type ? "border-teal-500 bg-teal-50 shadow-sm" : "border-slate-50 bg-slate-50"
                    )}
                  >
                    <span className="font-semibold text-slate-700">{type}</span>
                    {formData.diabetesType === type && <Check className="text-teal-600 h-5 w-5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Medications */}
          {step === 5 && (
            <div className="flex flex-col gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold font-urdu mb-2">کون سی ادویات لیتے ہیں؟</h2>
                <p className="text-slate-500 mb-4 font-urdu">(ایک سے زیادہ منتخب کر سکتے ہیں)</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {meds.map((med) => (
                  <button
                    key={med}
                    onClick={() => {
                      const current = [...formData.medications];
                      if (current.includes(med)) {
                        setFormData({ ...formData, medications: current.filter(m => m !== med) });
                      } else {
                        setFormData({ ...formData, medications: [...current, med] });
                      }
                    }}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center",
                      formData.medications.includes(med) ? "border-teal-500 bg-teal-50" : "border-slate-50 bg-slate-50"
                    )}
                  >
                    <span className="font-semibold text-slate-700">{med}</span>
                    {formData.medications.includes(med) && <Check className="text-teal-600 h-5 w-5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Emergency */}
          {step === 6 && (
            <div className="flex flex-col gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-bold font-urdu mb-2">ہنگامی رابطہ نمبر</h2>
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="family member phone number"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 ml-2 mb-2 font-urdu">روزانہ یاددہانی کا وقت</label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-auto pt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-5 rounded-2xl font-bold bg-slate-100 text-slate-500 transition-all active:scale-95 border-2 border-slate-50"
              >
                {formData.language === 'ur' ? 'پیچھے' : 'Back'}
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={step === 2 && !formData.name}
              className={cn(
                "flex-[2] py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                (step === 2 && !formData.name) ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-teal-600 text-white shadow-lg active:scale-95"
              )}
            >
              {step === steps.length ? (formData.language === 'ur' ? 'شروع کریں' : 'Get Started') : (formData.language === 'ur' ? 'آگے' : 'Next')}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
