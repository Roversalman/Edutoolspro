import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hash, Zap } from 'lucide-react';

export default function PrimeGenerator() {
  const [limit, setLimit] = useState('100');
  const [primes, setPrimes] = useState<number[]>([]);
  const navigate = useNavigate();

  const generatePrimes = () => {
    const n = parseInt(limit);
    if (isNaN(n) || n < 2) return;
    
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let p = 2; p * p <= n; p++) {
      if (sieve[p]) {
        for (let i = p * p; i <= n; i += p)
          sieve[i] = false;
      }
    }
    
    const result = [];
    for (let i = 2; i <= n; i++) {
      if (sieve[i]) result.push(i);
    }
    setPrimes(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Prime Generator</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-white/50">Generate primes up to:</label>
          <input
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>

        <button 
          onClick={generatePrimes}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap size={20} /> Generate
        </button>

        {primes.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/50 mb-4">Found {primes.length} Prime Numbers:</h3>
            <div className="flex flex-wrap gap-2">
              {primes.map(p => (
                <span key={p} className="px-3 py-1 bg-white/5 rounded-lg text-indigo-300 font-mono">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
