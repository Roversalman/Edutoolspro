import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Check, Zap, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthContext = React.createContext<any>(null); // Placeholder for context

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // In a real app, this would come from AuthContext
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Successfully upgraded to Premium!');
        navigate('/dashboard');
        window.location.reload(); // Refresh to update global state
      }
    } catch (error) {
      alert('Upgrade failed.');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Monthly",
      price: "15",
      period: "month",
      features: ["All AI Tools", "Quiz Contests", "ID Card Gen", "Priority Support", "No Ads"],
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Yearly",
      price: "150",
      period: "year",
      features: ["All Monthly Features", "2 Months Free", "Special Badge", "Beta Features", "Custom Profile"],
      color: "from-amber-400 to-orange-500",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Upgrade to Premium</h1>
      </div>

      <div className="text-center mb-12 space-y-4">
        <div className="w-20 h-20 bg-amber-500/20 rounded-3xl mx-auto flex items-center justify-center border border-amber-500/30 shadow-2xl">
          <Crown size={40} className="text-amber-400 fill-amber-400" />
        </div>
        <h2 className="text-3xl font-bold">Unlock Everything</h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Get unlimited access to all AI tools, quiz contests, and premium educational resources.
        </p>
      </div>

      <div className="space-y-6">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-white/5'} overflow-hidden shadow-2xl`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Best Value
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold">৳{plan.price}</span>
                <span className="text-white/40 text-sm">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="p-1 bg-emerald-500/20 rounded-full">
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.name)}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all bg-gradient-to-r ${plan.color}`}
            >
              {loading ? 'Processing...' : `Upgrade Now`}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Shield size={20} className="text-indigo-400" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase">Secure</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Zap size={20} className="text-amber-400" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase">Instant</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Star size={20} className="text-purple-400" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase">Premium</p>
        </div>
      </div>
    </div>
  );
}
