import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Image as ImageIcon } from 'lucide-react';
import { geminiService } from '../../services/geminiService';

export default function AIImageCreator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const imgUrl = await geminiService.generateImage(prompt);
      setImage(imgUrl);
    } catch (error) {
      alert('Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Image Creator <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Crown size={20} className="text-amber-400" />
          <p className="text-xs text-amber-200/70">Premium Tool: Generate stunning images from text.</p>
        </div>

        <textarea
          placeholder="Describe the image you want to create (e.g., 'A futuristic library in space with glowing books')"
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Creating...' : <><ImageIcon size={20} /> Generate Image</>}
        </button>

        {image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 overflow-hidden"
          >
            <img src={image} alt="Generated" className="w-full rounded-2xl shadow-2xl" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
