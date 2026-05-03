import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { getTriage } from '../utils/triage';
import { exportToPDF } from '../utils/pdfExport';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Download, ChevronLeft, Filter, FileText, Activity as ActivityIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function History() {
  const [days, setDays] = useState(7);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const allReadings = useLiveQuery(() => db.readings.orderBy('timestamp').reverse().toArray());
  const patient = useLiveQuery(() => db.patients.toArray().then(pts => pts[0]));

  const filteredReadings = allReadings 
    ? allReadings.filter(r => {
        const diff = Date.now() - r.timestamp;
        const msPerDay = 24 * 60 * 60 * 1000;
        return diff <= days * msPerDay;
      }).reverse() // Reverse for chart chronicity
    : [];

  const chartData = filteredReadings.map(r => ({
    time: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    value: r.value,
    status: r.triageStatus
  }));

  const stats = {
    avg: Math.round(filteredReadings.reduce((acc, r) => acc + r.value, 0) / (filteredReadings.length || 1)),
    max: Math.max(...filteredReadings.map(r => r.value), 0),
    min: Math.min(...filteredReadings.map(r => r.value), 0),
    target: Math.round((filteredReadings.filter(r => r.value >= 70 && r.value <= 140).length / (filteredReadings.length || 1)) * 100)
  };

  const handleDownload = async (period: string) => {
    if (!patient || !allReadings) return;
    setIsExporting(true);
    
    let chartImage: string | undefined;
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      chartImage = canvas.toDataURL('image/png');
    }

    await exportToPDF(patient, allReadings, period, chartImage);
    setIsExporting(false);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-20 shadow-sm border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">History & Trends</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all",
                days === d ? "bg-teal-600 text-white shadow-md" : "bg-slate-100 text-slate-500"
              )}
            >
              {d === 7 ? '7D' : d === 30 ? '30D' : '3M'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div ref={chartRef} className="mx-6 mt-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
            />
            <YAxis 
              hide 
              domain={['dataMin - 20', 'dataMax + 20']} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <ReferenceLine y={140} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Target', position: 'right', fill: '#10b981', fontSize: 10 }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0d9488" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#0d9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-teal-50 p-4 rounded-3xl flex flex-col gap-1 border border-teal-100">
          <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Average Glucose</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-teal-900">{stats.avg}</span>
            <span className="text-xs text-teal-600">mg/dL</span>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-3xl flex flex-col gap-1 border border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">In Target Range</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-bold text-emerald-900">{stats.target}</span>
            <span className="text-xs text-emerald-600">%</span>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-slate-800 mb-4 font-urdu text-right">رپورٹ ڈان لوڈ کریں</h3>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleDownload('Weekly')}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-teal-700/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            <span className="font-urdu">ہفتہ وار رپورٹ ڈان لوڈ کریں</span>
          </button>
          <button 
            onClick={() => handleDownload('Monthly')}
            disabled={isExporting}
            className="w-full bg-white text-teal-600 border-2 border-teal-600 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <FileText className="h-5 w-5" />
            <span className="font-urdu">ماہانہ رپورٹ ڈان لوڈ کریں</span>
          </button>
          <p className="text-center text-xs text-slate-400 font-urdu mt-2">یہ رپورٹ اپنے ڈاکٹر کو دکھائیں</p>
        </div>
      </div>

      {/* Readings List */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-tight text-sm">Full Data Log</h3>
        <div className="flex flex-col gap-3">
          {allReadings?.map((r) => {
            const tr = getTriage(r.value);
            return (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-mono font-bold text-lg", tr.color)}>
                    {r.value}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">{tr.label}</div>
                    <div className="text-[10px] text-slate-400">{new Date(r.timestamp).toLocaleDateString()} • {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                <div className="text-right max-w-[150px]">
                  <p className="font-urdu text-[11px] leading-tight text-slate-500">{tr.urduMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
