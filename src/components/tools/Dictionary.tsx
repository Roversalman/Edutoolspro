import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Volume2, Book, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

export default function Dictionary() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!word) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Define the word "${word}" in a student-friendly way. Return JSON with properties: word, phonetic, definition, example, synonyms (array).`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text);
      setDefinition(data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch definition');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(definition?.word || word);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Dictionary <Book size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for a word..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 rounded-xl text-black active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Search size={20} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {definition && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-bold capitalize">{definition.word}</h2>
                    <p className="text-emerald-400 font-mono text-sm mt-1">{definition.phonetic}</p>
                  </div>
                  <button 
                    onClick={playAudio}
                    className="p-4 bg-emerald-500/10 rounded-full text-emerald-400 hover:bg-emerald-500/20 transition-all"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-white/80 leading-relaxed">
                    {definition.definition}
                  </p>
                  {definition.example && (
                    <p className="text-white/40 italic text-sm">
                      "{definition.example}"
                    </p>
                  )}
                </div>
              </div>

              {definition.synonyms && definition.synonyms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Synonyms</h3>
                  <div className="flex flex-wrap gap-2">
                    {definition.synonyms.map((s: string) => (
                      <button 
                        key={s} 
                        onClick={() => { setWord(s); handleSearch(); }}
                        className="px-4 py-2 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all border border-white/5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!definition && !loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Book size={40} className="text-white/10" />
            </div>
            <p className="text-white/40 text-sm">Search for any word to see its definition, phonetics, and examples.</p>
          </div>
        )}
      </div>
    </div>
  );
}
