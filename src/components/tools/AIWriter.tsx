import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function AIWriter() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const prompt = `Write a professional paragraph or article about: ${topic}. Make it educational and engaging.`;
      const generated = await geminiService.generateText(prompt, "You are a professional academic writer.");
      setContent(generated || '');
    } catch (error) {
      setContent('Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Writer <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Crown size={20} className="text-amber-400" />
          <p className="text-xs text-amber-200/70">This is a Premium Tool. You have full access.</p>
        </div>

        <input
          type="text"
          placeholder="What should I write about?"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Writing...' : <><Wand2 size={20} /> Generate Content</>}
        </button>

        {content && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Crown } from 'lucide-react';
