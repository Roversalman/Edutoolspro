import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calculator, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Subject {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const gradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export default function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', grade: 'A', credits: 3 }
  ]);
  const navigate = useNavigate();

  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: '', grade: 'A', credits: 3 }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(s => {
      totalPoints += gradePoints[s.grade] * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          GPA Calculator <GraduationCap size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Your Current GPA</p>
          <h2 className="text-6xl font-bold">{calculateGPA()}</h2>
        </div>

        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={subject.id} 
              className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-3 items-end"
            >
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Subject Name</label>
                <input 
                  type="text" 
                  placeholder={`Subject ${index + 1}`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Grade</label>
                <select 
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={subject.grade}
                  onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                >
                  {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="w-16 space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Credits</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                  value={subject.credits}
                  onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                onClick={() => removeSubject(subject.id)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors mb-0.5"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={addSubject}
          className="w-full py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-white/10 transition-all"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>
    </div>
  );
}
