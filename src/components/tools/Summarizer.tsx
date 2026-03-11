import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function Summarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await geminiService.summarize(text);
      setSummary(result || '');
    } catch (error) {
      setSummary('Summarization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Summarizer <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Paste long text here to summarize..."
          className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={handleSummarize}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Summarizing...' : <><FileText size={20} /> Summarize Now</>}
        </button>

        {summary && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/50 mb-2">Summary:</h3>
            <p className="text-lg leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
