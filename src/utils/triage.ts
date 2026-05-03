export type TriageEntry = {
  status: 'emergency' | 'excellent' | 'normal' | 'elevated' | 'high' | 'critical';
  label: string;
  urduMessage: string;
  color: string;
  icon: string;
};

export const getTriage = (value: number): TriageEntry => {
  if (value < 70) {
    return {
      status: 'emergency',
      label: 'Emergency',
      urduMessage: 'خطرہ! شوگر بہت کم ہے۔ ابھی میٹھا کھائیں اور ڈاکٹر کو فون کریں۔',
      color: 'bg-red-600',
      icon: '🔴'
    };
  }
  if (value >= 70 && value <= 100) {
    return {
      status: 'excellent',
      label: 'Excellent',
      urduMessage: 'بہت اچھا! آج کی ریڈنگ بالکل ٹھیک ہے۔ شاباش! 🌟',
      color: 'bg-green-600',
      icon: '🟢'
    };
  }
  if (value >= 101 && value <= 140) {
    return {
      status: 'normal',
      label: 'Normal',
      urduMessage: 'ریڈنگ ٹھیک ہے۔ دوائی وقت پر لیں اور پرہیز جاری رکھیں۔',
      color: 'bg-emerald-500',
      icon: '✅'
    };
  }
  if (value >= 141 && value <= 200) {
    return {
      status: 'elevated',
      label: 'Elevated',
      urduMessage: 'ریڈنگ تھوڑی زیادہ ہے۔ پانی زیادہ پئیں اور میٹھا کم کریں۔',
      color: 'bg-amber-500',
      icon: '⚠️'
    };
  }
  if (value >= 201 && value <= 350) {
    return {
      status: 'high',
      label: 'High',
      urduMessage: 'ریڈنگ کافی زیادہ ہے۔ دھیان دیں اور اپنی دوائی وقت پر لیں۔',
      color: 'bg-orange-600',
      icon: '🔶'
    };
  }
  return {
    status: 'critical',
    label: 'Critical',
    urduMessage: 'بہت خطرناک! فوری ڈاکٹر سے ملیں یا گھر والوں کو بتائیں۔',
    color: 'bg-red-700',
    icon: '🚨'
  };
};
