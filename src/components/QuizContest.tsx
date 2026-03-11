import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizContest() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Quiz Contest</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/10">
          <h3 className="text-lg font-bold mb-1 text-black">Monthly Quiz</h3>
          <p className="text-black/60 text-xs mb-4">Win ৳500 Prize</p>
          <button className="w-full bg-black/10 backdrop-blur-md py-2 rounded-xl text-sm font-bold text-black border border-black/10">Join Now</button>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-lg shadow-amber-500/10">
          <h3 className="text-lg font-bold mb-1 text-black">Yearly Quiz</h3>
          <p className="text-black/60 text-xs mb-4">Win ৳5000 Prize</p>
          <button className="w-full bg-black/10 backdrop-blur-md py-2 rounded-xl text-sm font-bold text-black border border-black/10">Join Now</button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-amber-400" /> Leaderboard
      </h2>

      <div className="space-y-3">
        {leaderboard.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.userId}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
              index === 0 ? "bg-amber-400 text-black" : 
              index === 1 ? "bg-slate-300 text-black" :
              index === 2 ? "bg-orange-400 text-black" : "bg-white/10"
            )}>
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-white/40">{item.userId}</div>
            </div>
            <div className="text-emerald-400 font-bold">{item.total_score} pts</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
