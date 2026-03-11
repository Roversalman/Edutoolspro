import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenTool, Sparkles, Download } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { motion } from 'framer-motion';

export default function LogoCreator() {
  const [brandName, setBrandName] = useState('');
  const [style, setStyle] = useState('Modern');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!brandName) return;
    setLoading(true);
    try {
      const prompt = `Create a professional logo for a brand named "${brandName}". Style: ${style}, minimalist, vector art, clean white background, high contrast.`;
      const imgUrl = await geminiService.generateImage(prompt);
      setImage(imgUrl);
    } catch (error) {
      alert('Logo generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Logo Creator <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Brand Name"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['Modern', 'Vintage', 'Futuristic', 'Playful', 'Elegant'].map(s => (
              <button 
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${style === s ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/40'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Designing...' : <><PenTool size={20} /> Generate Logo</>}
        </button>

        {image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm aspect-square flex items-center justify-center">
              <img src={image} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <button className="flex items-center gap-2 text-emerald-400 font-bold">
              <Download size={20} /> Download Logo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
