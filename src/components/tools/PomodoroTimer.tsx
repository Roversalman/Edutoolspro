import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Brain, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [sessions, setSessions] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    work: { label: 'Work', time: 25 * 60, color: 'emerald' },
    short: { label: 'Short Break', time: 5 * 60, color: 'blue' },
    long: { label: 'Long Break', time: 15 * 60, color: 'purple' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Play sound (simulated)
    alert(`${modes[mode].label} session complete!`);

    if (mode === 'work') {
      setSessions(prev => prev + 1);
      if ((sessions + 1) % 4 === 0) {
        switchMode('long');
      } else {
        switchMode('short');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode: keyof typeof modes) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / modes[mode].time) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Study Timer</h1>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Brain size={14} className="text-emerald-400" />
          <span className="text-xs font-bold">{sessions} Sessions</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        {/* Mode Switcher */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
          {Object.entries(modes).map(([key, m]) => (
            <button
              key={key}
              onClick={() => switchMode(key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === key ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/5"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="130"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="816.8"
              animate={{ strokeDashoffset: 816.8 * (1 - progress / 100) }}
              className="text-emerald-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-bold font-mono tracking-tighter">{formatTime(timeLeft)}</span>
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">{modes[mode].label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={resetTimer}
            className="p-4 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-2xl shadow-emerald-500/20 active:scale-90 transition-all"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button className="p-4 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Bell size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Coffee size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase">Break</p>
            <p className="text-sm font-bold">5 Mins</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
            <Brain size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase">Work</p>
            <p className="text-sm font-bold">25 Mins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
