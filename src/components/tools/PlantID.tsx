import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Search, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function PlantID() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyPlant = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          },
          { text: "Identify this plant. Provide its common name, scientific name, care instructions, and interesting facts." }
        ]
      });
      
      setResult(response.text || 'Could not identify plant.');
    } catch (error) {
      setResult('Identification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Plant ID <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Crown size={20} className="text-amber-400" />
          <p className="text-xs text-amber-200/70">Premium Tool: Identify any plant with a photo.</p>
        </div>

        <div className="relative aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Plant" className="w-full h-full object-cover" />
          ) : (
            <>
              <Camera size={48} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Upload or Take Photo</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>

        <button 
          onClick={identifyPlant}
          disabled={loading || !image}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Identifying...' : <><Search size={20} /> Identify Plant</>}
        </button>

        {result && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Crown } from 'lucide-react';
