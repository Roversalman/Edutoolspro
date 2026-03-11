import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Copy, Check, ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function ImageToText() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
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
          { text: "Extract all text from this image. Provide only the extracted text." }
        ]
      });
      
      setText(response.text || 'No text found.');
    } catch (error) {
      setText('Extraction failed.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Image to Text</h1>
      </div>

      <div className="space-y-6">
        <div className="relative aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Upload" className="w-full h-full object-contain" />
          ) : (
            <>
              <ImageIcon size={48} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Upload Image with Text</p>
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
          onClick={extractText}
          disabled={loading || !image}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Extracting...' : 'Extract Text'}
        </button>

        {text && (
          <div className="relative">
            <textarea
              readOnly
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
              value={text}
            />
            <button onClick={copy} className="absolute bottom-4 right-4 p-2 bg-white/10 rounded-lg text-white/60">
              {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
