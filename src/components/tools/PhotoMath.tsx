import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Sparkles, Loader2, Brain, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

export default function PhotoMath() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
      analyzeMath(dataUrl);
    }
  };

  const analyzeMath = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Solve this math problem step by step. Provide the final answer clearly." },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }
        ]
      });
      setSolution(response.text || "Could not solve the problem. Please try a clearer photo.");
    } catch (err) {
      console.error("AI Error:", err);
      setSolution("Error analyzing the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSolution(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            Photo Math <Brain size={18} className="text-emerald-400" />
          </h1>
        </div>
        {image && (
          <button onClick={reset} className="p-2 hover:bg-white/5 rounded-full text-emerald-400">
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          {!image ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-500/30 m-8 rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
              </div>
              <button 
                onClick={captureImage}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 p-1 active:scale-90 transition-all shadow-xl"
              >
                <div className="w-full h-full bg-white rounded-full border border-slate-200" />
              </button>
            </>
          ) : (
            <img src={image} className="w-full h-full object-cover" alt="Captured" />
          )}
          
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
              >
                <Loader2 size={48} className="text-emerald-400 animate-spin" />
                <p className="text-lg font-bold animate-pulse">Solving Problem...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {solution && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-white/5 rounded-3xl border border-white/10 shadow-xl"
          >
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Solution
            </h3>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {solution}
            </div>
          </motion.div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
