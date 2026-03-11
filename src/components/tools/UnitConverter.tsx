import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, Ruler, Weight, Thermometer, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274
  },
  temperature: {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K'
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof units>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState<string>('1');
  const [result, setResult] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(units[category]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [category]);

  useEffect(() => {
    handleConvert();
  }, [value, fromUnit, toUnit]);

  const handleConvert = () => {
    if (!value || isNaN(Number(value))) return;
    
    if (category === 'temperature') {
      let val = Number(value);
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = (val - 32) * 5/9;
      if (fromUnit === 'kelvin') celsius = val - 273.15;

      let res = celsius;
      if (toUnit === 'fahrenheit') res = (celsius * 9/5) + 32;
      if (toUnit === 'kelvin') res = celsius + 273.15;
      setResult(res.toFixed(2));
    } else {
      const fromRate = (units[category] as any)[fromUnit];
      const toRate = (units[category] as any)[toUnit];
      const res = (Number(value) / fromRate) * toRate;
      setResult(res.toLocaleString(undefined, { maximumFractionDigits: 4 }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Unit Converter <Repeat size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'length', icon: <Ruler size={16} />, label: 'Length' },
            { id: 'weight', icon: <Weight size={16} />, label: 'Weight' },
            { id: 'temperature', icon: <Thermometer size={16} />, label: 'Temp' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCategory(item.id as any)}
              className={`flex-1 min-w-[80px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${category === item.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">From</label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select 
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-32 bg-slate-900 border border-white/10 rounded-2xl px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <Repeat size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">To</label>
              <div className="flex gap-3">
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-4 text-xl font-bold text-emerald-400">
                  {result}
                </div>
                <select 
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-32 bg-slate-900 border border-white/10 rounded-2xl px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-start gap-3">
          <Zap size={20} className="text-amber-400 shrink-0 mt-1" />
          <div>
            <p className="text-xs font-bold text-white/60">Pro Tip</p>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Use the unit converter for your science projects or daily measurements. It supports length, weight, and temperature conversions instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
