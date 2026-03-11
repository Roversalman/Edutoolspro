import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Percent, DollarSign, Calendar } from 'lucide-react';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('');
  const [years, setYears] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const navigate = useNavigate();

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(interest) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (p && r && n) {
      const x = Math.pow(1 + r, n);
      const monthly = (p * x * r) / (x - 1);
      setMonthlyPayment(monthly);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Loan Calculator</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="number"
              placeholder="Loan Amount"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="relative">
            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="number"
              placeholder="Loan Term (Years)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95"
        >
          Calculate
        </button>

        {monthlyPayment !== null && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <h3 className="text-white/50 mb-2">Monthly Payment</h3>
            <div className="text-4xl font-bold text-indigo-400">
              ৳{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-3 rounded-xl">
                <div className="text-white/40">Total Interest</div>
                <div className="font-semibold">৳{(monthlyPayment * parseFloat(years) * 12 - parseFloat(amount)).toLocaleString()}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <div className="text-white/40">Total Payment</div>
                <div className="font-semibold">৳{(monthlyPayment * parseFloat(years) * 12).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
