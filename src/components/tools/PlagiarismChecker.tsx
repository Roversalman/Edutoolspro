import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

export default function PlagiarismChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (!text || text.length < 20) {
      alert('Please enter at least 20 characters.');
      return;
    }
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following text for potential plagiarism. Provide a simulated report. Return JSON with properties: score (0-100, where 0 is unique), matches (array of objects with source and percentage), summary. Text: "${text}"`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Plagiarism Checker <ShieldCheck size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
          <textarea 
            placeholder="Paste your text here to check for plagiarism (min 20 chars)..."
            className="w-full h-64 bg-transparent border-none focus:outline-none text-sm leading-relaxed placeholder-white/20 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{text.length} Characters</span>
            <button 
              onClick={handleCheck}
              disabled={loading || text.length < 20}
              className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl text-black font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Check Plagiarism'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Uniqueness Score</h3>
                    <p className="text-3xl font-bold">{100 - result.score}% Unique</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold ${result.score > 20 ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-500'}`}>
                    {result.score}%
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Search size={14} /> Potential Matches
                  </h3>
                  {result.matches && result.matches.length > 0 ? (
                    <div className="space-y-3">
                      {result.matches.map((match: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs font-medium text-white/60 truncate flex-1 pr-4">{match.source}</span>
                          <span className="text-xs font-bold text-rose-400">{match.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle size={18} /> No significant matches found!
                    </div>
                  )}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">AI Summary</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/5 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-1" />
          <p className="text-[10px] text-white/40 leading-relaxed">
            This tool uses AI to simulate a plagiarism check. For official academic submissions, please use institutional tools like Turnitin.
          </p>
        </div>
      </div>
    </div>
  );
}
