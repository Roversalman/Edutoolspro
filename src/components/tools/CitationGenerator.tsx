import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CitationGenerator() {
  const [format, setFormat] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [data, setData] = useState({
    author: '',
    title: '',
    year: '',
    publisher: '',
    url: ''
  });
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateCitation = () => {
    const { author, title, year, publisher, url } = data;
    if (!author || !title) return "Please enter at least Author and Title";

    if (format === 'APA') {
      return `${author}. (${year}). ${title}. ${publisher}. ${url}`;
    } else if (format === 'MLA') {
      return `${author}. "${title}." ${publisher}, ${year}, ${url}.`;
    } else {
      return `${author}. ${title}. ${publisher}, ${year}. ${url}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Citation Generator <BookOpen size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
          {['APA', 'MLA', 'Chicago'].map(f => (
            <button
              key={f}
              onClick={() => setFormat(f as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${format === f ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Author(s)</label>
              <input 
                type="text" 
                placeholder="e.g. Smith, J."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={data.author}
                onChange={(e) => setData({ ...data, author: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Title</label>
              <input 
                type="text" 
                placeholder="e.g. The Future of AI"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Year</label>
                <input 
                  type="text" 
                  placeholder="2024"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={data.year}
                  onChange={(e) => setData({ ...data, year: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Publisher</label>
                <input 
                  type="text" 
                  placeholder="Oxford Press"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={data.publisher}
                  onChange={(e) => setData({ ...data, publisher: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">URL (Optional)</label>
              <input 
                type="text" 
                placeholder="https://example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 relative group">
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Resulting Citation</h3>
          <p className="text-sm italic leading-relaxed pr-8">
            {generateCitation()}
          </p>
          <button 
            onClick={handleCopy}
            className="absolute top-6 right-6 p-2 bg-emerald-500 rounded-lg text-black hover:scale-110 transition-transform active:scale-95"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles size={20} className="text-emerald-400 shrink-0 mt-1" />
          <p className="text-[10px] text-white/40 leading-relaxed">
            Citations are essential for academic integrity. Always double-check with your official style guide for specific requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
