import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pipette, Copy, Check, Palette, RefreshCw, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorIdentifier() {
  const [pickedColor, setPickedColor] = useState('#10b981');
  const [copied, setCopied] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const palette = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf', 
    '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', 
    '#e879f9', '#f472b6', '#fb7185', '#94a3b8'
  ];

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
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const pickColor = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        // Get color from the center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setPickedColor(hex);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pickedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            Color ID <Palette size={18} className="text-emerald-400" />
          </h1>
        </div>
        <button onClick={startCamera} className="p-2 hover:bg-white/5 rounded-full text-emerald-400">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-6">
        {/* Camera View */}
        <div className="relative aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
          <button 
            onClick={pickColor}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Pipette size={18} /> Pick Color
          </button>
        </div>

        {/* Result Card */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl shadow-inner border border-white/20"
              style={{ backgroundColor: pickedColor }}
            />
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Hex Code</p>
              <p className="text-2xl font-mono font-bold">{pickedColor.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={copyToClipboard}
            className={`p-4 rounded-2xl transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>

        {/* Palette */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Color Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {palette.map(color => (
              <button
                key={color}
                onClick={() => setPickedColor(color)}
                className="aspect-square rounded-xl border border-white/10 shadow-sm active:scale-90 transition-all"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
