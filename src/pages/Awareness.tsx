import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import { 
  HelpCircle, Apple, AlertTriangle, PlayCircle, Moon, MapPin, 
  Check, X, ArrowRight, Activity, Clock, Phone, Navigation2 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

// --- Sub-components for each card content ---

const MythsContent = () => {
  const myths = [
    { m: 'شوگر صرف میٹھا کھانے سے ہوتی ہے', f: 'غلط! شوگر موروثی اور غیر صحت بخش طرز زندگی سے بھی ہو سکتی ہے' },
    { m: 'شوگر ٹھیک ہو جاتی ہے', f: 'غلط! شوگر کو کنٹرول کیا جا سکتا ہے لیکن یہ مکمل ختم نہیں ہوتی' },
    { m: 'انسولین کمزور لوگوں کے لیے ہے', f: 'غلط! انسولین جسم میں شوگر کنٹرول کرنے کے لیے ضروری ہارمون ہے' },
    { m: 'شوگر میں پھل نہیں کھا سکتے', f: 'غلط! مخصوص پھل مناسب مقدار میں کھائے جا سکتے ہیں' },
    { m: 'شوگر میں روزہ نہیں رکھ سکتے', f: 'غلط! ڈاکٹر کے مشورے اور احتیاط کے ساتھ روزہ رکھا جا سکتا ہے' },
    { m: 'علامات نہیں تو شوگر ٹھیک ہے', f: 'غلط! شوگر اندرونی طور پر خاموشی سے نقصان پہنچاتی رہتی ہے' },
  ];

  return (
    <div className="p-6 grid grid-cols-1 gap-4">
      {myths.map((item, i) => (
        <FlipCard key={i} myth={item.m} fact={item.f} />
      ))}
    </div>
  );
};

const FlipCard = ({ myth, fact }: { myth: string; fact: string; key?: any }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      className="perspective-1000 cursor-pointer h-24"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full h-full relative preserve-3d"
      >
        <div className="absolute inset-0 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center p-4 backface-hidden">
          <p className="font-urdu text-center text-amber-800 font-bold">{myth}</p>
        </div>
        <div className="absolute inset-0 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center p-4 backface-hidden rotate-y-180">
          <p className="font-urdu text-center text-green-800 font-bold">{fact}</p>
        </div>
      </motion.div>
    </div>
  );
};

const FoodContent = () => {
  const foods = {
    green: ['سبزیاں', 'دالیں', 'دہی', 'روٹی', 'مچھلی', 'انڈا'],
    amber: ['پھل', 'چاول', 'دودھ', 'بریڈ', 'آلو', 'کیلا'],
    red: ['میٹھائی', 'کولڈ ڈرنک', 'چینی', 'تلی چیزیں', 'کیک', 'جام']
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h4 className="font-bold font-urdu">کھائیں (Eat Freely)</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {foods.green.map(f => (
              <div key={f} className="bg-green-50 p-3 rounded-xl text-center border border-green-100">
                <p className="font-urdu text-sm font-bold text-green-800">{f}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <h4 className="font-bold font-urdu">محدود (Eat Sparingly)</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {foods.amber.map(f => (
              <div key={f} className="bg-amber-50 p-3 rounded-xl text-center border border-amber-100">
                <p className="font-urdu text-sm font-bold text-amber-800">{f}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h4 className="font-bold font-urdu">پرہیز (Avoid)</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {foods.red.map(f => (
              <div key={f} className="bg-red-50 p-3 rounded-xl text-center border border-red-100">
                <p className="font-urdu text-sm font-bold text-red-800">{f}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const SymptomContent = () => {
  const symptoms = [
    { ur: 'چکر آنا', en: 'Dizziness', desc: 'اگر سر گھوم رہا ہو تو فوری شوگر چیک کریں' },
    { ur: 'بہت زیادہ پیاس', en: 'Excessive Thirst', desc: 'بار بار منہ خشک ہونا ہائی شوگر کی علامت ہو سکتی ہے' },
    { ur: 'باربار پیشاب', en: 'Frequent Urination', desc: 'رات کو بار بار پیشاب آنا' },
    { ur: 'دھندلا نظر', en: 'Blurry Vision', desc: 'بینائی میں تبدیلی محسوس ہونا' },
    { ur: 'پاؤں میں جھنجھناہٹ', en: 'Tingling Feet', desc: 'پیروں کا سن ہونا یا سوئیوں جیسا چبھنا' },
  ];

  return (
    <div className="p-6 flex flex-col gap-4">
      {symptoms.map((s, i) => (
        <div key={i} className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
          <div className="text-right flex-grow">
            <h4 className="font-urdu font-bold text-lg text-red-800">{s.ur}</h4>
            <p className="font-urdu text-xs text-red-600">{s.desc}</p>
          </div>
          <div className="ml-4 pl-4 border-l border-red-200">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-tighter">Emergency</span>
            <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{s.en}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ExerciseContent = () => {
  const exercises = [
    { t: 'پیدل چلنا', d: '30 min', icon: '🚶' },
    { t: 'یوگا / ہلکی ورزش', d: '20 min', icon: '🧘' },
    { t: 'سائیکلنگ', d: '25 min', icon: '🚴' },
    { t: 'تیراکی', d: '20 min', icon: '🏊' },
  ];
  return (
    <div className="p-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-6 flex items-center gap-4">
        <Activity className="h-8 w-8 text-blue-600" />
        <p className="font-urdu font-bold text-blue-800 text-lg">ورزش سے پہلے اپنی شوگر ضرور چیک کریں!</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {exercises.map(e => (
          <div key={e.t} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
            <span className="text-4xl animate-bounce">{e.icon}</span>
            <span className="font-urdu font-bold">{e.t}</span>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">{e.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RamadanContent = () => {
  return (
    <div className="p-6 bg-slate-50">
      <div className="bg-indigo-900 rounded-[30px] p-8 text-white relative overflow-hidden mb-6 shadow-xl">
        <Moon className="absolute -right-2 -top-2 w-24 h-24 text-white/10" />
        <h3 className="font-urdu text-3xl font-bold mb-2">روزہ اور شوگر</h3>
        <p className="text-indigo-200 font-urdu">رمضان کے دوران محفوظ رہنے کے طریقے</p>
      </div>
      <div className="space-y-4">
        {[
          { icon: '👨‍⚕️', text: 'روزے سے پہلے اپنے ڈاکٹر سے مشورہ کریں' },
          { icon: '🌾', text: 'سحری میں فائبر والی چیزیں (جیسے جو، دالیں) کھائیں' },
          { icon: '💧', text: 'افطار سے سحر تک پانی کا زیادہ استعمال کریں' },
          { icon: '🩺', text: 'روزے کے دوران باقاعدگی سے شوگر چیک کریں' },
          { icon: '🌙', text: 'تراویح سے پہلے کافی پانی پیئں' },
          { icon: '⚠️', text: 'اگر شوگر 70 سے کم ہو جائے تو فوری روزہ توڑ دیں' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
            <span className="text-2xl">{item.icon}</span>
            <p className="font-urdu font-bold text-slate-700">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CenterContent = () => {
  const cities = {
    'RYK': [{ name: 'Sheikh Zayed Hospital', addr: 'Airport Rd', phone: '068-9230101', free: true }],
    'Lahore': [{ name: 'Services Hospital', addr: 'Ghaus-ul-Azam Rd', phone: '042-99203402', free: true }, { name: 'Mayo Hospital', addr: 'Hospital Rd', phone: '042-7230531', free: true }],
    'Karachi': [{ name: 'Civil Hospital', addr: 'Mission Rd', phone: '021-99215740', free: true }, { name: 'Jinnah Hospital', addr: 'Rafique Shaheed Rd', phone: '021-99201300', free: true }],
    'Multan': [{ name: 'Nishtar Hospital', addr: 'Nishtar Rd', phone: '061-9200231', free: true }],
    'Islamabad': [{ name: 'PIMS', addr: 'Sector G-8/3', phone: '051-9261170', free: true }],
    'Faisalabad': [{ name: 'Allied Hospital', addr: 'Sargodha Rd', phone: '041-9210080', free: true }]
  };

  const [selectedCity, setSelectedCity] = useState<keyof typeof cities>('RYK');

  return (
    <div className="p-6">
      <select 
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value as any)}
        className="w-full p-4 bg-slate-50 rounded-2xl mb-6 border-none outline-none font-bold text-teal-600 appearance-none"
      >
        {Object.keys(cities).map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="space-y-4">
        {cities[selectedCity]?.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800">{c.name}</h4>
              {c.free && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">FREE OPD</span>}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <MapPin className="h-4 w-4" />
              <span>{c.addr}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-grow bg-teal-50 text-teal-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" /> Call Now
              </button>
              <button className="flex-grow bg-teal-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-700/20">
                <Navigation2 className="h-4 w-4" /> Direction
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Awareness() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    { id: 'myths', title: 'Myths vs Facts', titleUrdu: 'حقائق اور غلط فہمیاں', icon: HelpCircle, color: 'from-amber-400 to-orange-500', emoji: '🤔', content: <MythsContent /> },
    { id: 'food', title: 'Food Guide', titleUrdu: 'غذا کا گائیڈ', icon: Apple, color: 'from-green-400 to-emerald-600', emoji: '🥗', content: <FoodContent /> },
    { id: 'symptoms', title: 'Warning Signs', titleUrdu: 'خطرے کی علامات', icon: AlertTriangle, color: 'from-red-400 to-rose-600', emoji: '⚠️', content: <SymptomContent /> },
    { id: 'exercise', title: 'Exercise Guide', titleUrdu: 'ورزش کا گائیڈ', icon: PlayCircle, color: 'from-blue-400 to-indigo-600', emoji: '🏃', content: <ExerciseContent /> },
    { id: 'ramadan', title: 'Ramadan Special', titleUrdu: 'رمضان اور شوگر', icon: Moon, color: 'from-indigo-500 to-purple-700', emoji: '🌙', content: <RamadanContent /> },
    { id: 'centers', title: 'Nearest Centers', titleUrdu: 'قریبی ہسپتال', icon: MapPin, color: 'from-teal-400 to-teal-700', emoji: '🏥', content: <CenterContent /> },
  ];

  const currentModule = modules.find(m => m.id === activeModule);

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[30px] p-8 text-white relative overflow-hidden mb-8 shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-urdu mb-2">صحت کا علم</h2>
          <p className="text-purple-100 opacity-80">Empowering your diabetes journey through knowledge.</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12">
          <HelpCircle size={150} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            className="group relative h-44 rounded-[30px] overflow-hidden flex flex-col items-center justify-center gap-3 p-4 transition-all hover:scale-[0.98] active:scale-[0.95]"
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", m.color)} />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-4xl group-hover:scale-125 transition-transform">{m.emoji}</span>
              <h4 className="text-white font-urdu font-bold text-lg leading-tight text-center">{m.titleUrdu}</h4>
              <p className="text-white/70 text-[8px] uppercase font-bold tracking-widest">{m.title}</p>
            </div>
            <div className="absolute top-2 right-2 p-2 bg-white/10 rounded-full backdrop-blur-sm">
              <m.icon className="h-4 w-4 text-white/50" />
            </div>
          </button>
        ))}
      </div>

      <BottomSheet
        isOpen={!!activeModule}
        onClose={() => setActiveModule(null)}
        titleUrdu={currentModule?.titleUrdu}
        title={currentModule?.title}
      >
        {currentModule?.content}
      </BottomSheet>
    </div>
  );
}
