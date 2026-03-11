import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scissors, Download, ImageIcon, Sparkles, Eraser } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
            {
              text: 'Remove the background from this image and return only the subject on a transparent background. If transparency is not possible, use a solid white background.',
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      alert('Background removal failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          BG Remover <Sparkles size={20} className="text-amber-400" />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="relative aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Original" className="w-full h-full object-contain" />
          ) : (
            <>
              <ImageIcon size={48} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Upload Image</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>

        <button 
          onClick={removeBackground}
          disabled={loading || !image}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Eraser size={20} /> Remove Background</>}
        </button>

        {result && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/50">Result:</h3>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 flex items-center justify-center">
              <img src={result} alt="Result" className="max-w-full h-auto rounded-xl" />
            </div>
            <button className="w-full bg-white/5 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10">
              <Download size={20} /> Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
