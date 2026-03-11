import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Send, Sparkles } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function MathSolver() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSolve = async () => {
    if (!problem) return;
    setLoading(true);
    try {
      const result = await geminiService.solveMath(problem);
      setSolution(result || '');
    } catch (error) {
      setSolution('Failed to solve problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Math Solver <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Enter math problem (e.g., 'Solve for x: 2x + 5 = 15' or 'What is the derivative of x^2?')"
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <button 
          onClick={handleSolve}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Solving...' : <><Brain size={20} /> Solve Problem</>}
        </button>

        {solution && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/50 mb-4">Step-by-Step Solution:</h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed prose prose-invert max-w-none">
              {solution}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
