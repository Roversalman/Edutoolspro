import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Languages } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function Translator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState('Bengali');
  const navigate = useNavigate();

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const prompt = `Translate the following text to ${targetLang}: "${text}"`;
      const translated = await geminiService.generateText(prompt, "You are a professional translator.");
      setResult(translated || '');
    } catch (error) {
      setResult('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">AI Translator</h1>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setTargetLang('Bengali')}
            className={`flex-1 py-2 rounded-xl border transition-all ${targetLang === 'Bengali' ? 'bg-indigo-500 border-indigo-400' : 'bg-white/5 border-white/10'}`}
          >
            To Bengali
          </button>
          <button 
            onClick={() => setTargetLang('English')}
            className={`flex-1 py-2 rounded-xl border transition-all ${targetLang === 'English' ? 'bg-indigo-500 border-indigo-400' : 'bg-white/5 border-white/10'}`}
          >
            To English
          </button>
        </div>

        <textarea
          placeholder="Enter text to translate..."
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={handleTranslate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>

        {result && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white/50 mb-2">Result:</h3>
            <p className="text-lg leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
