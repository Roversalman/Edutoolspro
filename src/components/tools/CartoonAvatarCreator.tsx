import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Sparkles, Download } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { motion } from 'framer-motion';

export default function CartoonAvatarCreator() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const prompt = `Create a high-quality 3D cartoon avatar based on this description: ${description}. Style: Pixar/Disney style, vibrant colors, clean background.`;
      const imgUrl = await geminiService.generateImage(prompt);
      setImage(imgUrl);
    } catch (error) {
      alert('Avatar generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Avatar Creator <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Describe yourself (e.g., 'A boy with glasses and a blue hoodie' or 'A girl with long purple hair')"
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Designing...' : <><User size={20} /> Create Avatar</>}
        </button>

        {image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-4 overflow-hidden w-64 h-64 shadow-2xl">
              <img src={image} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
            <button className="flex items-center gap-2 text-indigo-400 font-bold">
              <Download size={20} /> Download Avatar
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
