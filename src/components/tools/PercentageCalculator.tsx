import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Percent, Calculator } from 'lucide-react';

export default function PercentageCalculator() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [mode, setMode] = useState<'of' | 'isWhat' | 'change'>('of');
  const navigate = useNavigate();

  const calculate = () => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2)) return;

    if (mode === 'of') {
      setResult((v1 / 100) * v2);
    } else if (mode === 'isWhat') {
      setResult((v1 / v2) * 100);
    } else if (mode === 'change') {
      setResult(((v2 - v1) / v1) * 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Percentage Calc</h1>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setMode('of')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'of' ? 'bg-indigo-500' : ''}`}
          >
            X% of Y
          </button>
          <button 
            onClick={() => setMode('isWhat')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'isWhat' ? 'bg-indigo-500' : ''}`}
          >
            X is what % of Y
          </button>
          <button 
            onClick={() => setMode('change')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'change' ? 'bg-indigo-500' : ''}`}
          >
            % Change
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="number"
            placeholder={mode === 'change' ? 'Old Value' : 'Value 1'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
          />
          <input
            type="number"
            placeholder={mode === 'change' ? 'New Value' : 'Value 2'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
          />
        </div>

        <button 
          onClick={calculate}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <h3 className="text-white/50 mb-2">Result</h3>
            <div className="text-4xl font-bold text-indigo-400">
              {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {mode !== 'of' && '%'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
