import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function GrammarCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const checked = await geminiService.grammarCheck(text);
      setResult(checked || '');
    } catch (error) {
      setResult('Check failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Grammar Check</h1>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Enter text to check grammar..."
          className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Checking...' : <><Sparkles size={20} /> Check Grammar</>}
        </button>

        {result && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/50 mb-2">Analysis:</h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
