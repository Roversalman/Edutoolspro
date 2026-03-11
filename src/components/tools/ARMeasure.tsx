import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ruler, RefreshCw, Plus, Trash2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

export default function ARMeasure() {
  const [points, setPoints] = useState<Point[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const addPoint = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }
    setPoints([...points, { x, y }]);
  };

  const calculateDistance = (p1: Point, p2: Point) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const pixels = Math.sqrt(dx * dx + dy * dy);
    // Simulated scale: 100 pixels = 10cm
    const cm = pixels / 10;
    return unit === 'cm' ? cm.toFixed(1) : (cm * 0.393701).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            AR Measure <Ruler size={18} className="text-emerald-400" />
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setUnit(unit === 'cm' ? 'inch' : 'cm')}
            className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase"
          >
            {unit}
          </button>
          <button onClick={() => setPoints([])} className="p-2 hover:bg-white/5 rounded-full text-rose-400">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative" ref={containerRef} onMouseDown={addPoint}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {points.map((p, i) => (
            <React.Fragment key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
              {i > 0 && (
                <>
                  <line 
                    x1={points[i-1].x} y1={points[i-1].y} 
                    x2={p.x} y2={p.y} 
                    stroke="#10b981" strokeWidth="3" strokeDasharray="5,5"
                  />
                  <text 
                    x={(points[i-1].x + p.x) / 2} 
                    y={(points[i-1].y + p.y) / 2 - 10} 
                    fill="white" 
                    fontSize="14" 
                    fontWeight="bold"
                    textAnchor="middle"
                    className="drop-shadow-lg"
                  >
                    {calculateDistance(points[i-1], p)} {unit}
                  </text>
                </>
              )}
            </React.Fragment>
          ))}
        </svg>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Instructions</p>
            <p className="text-sm font-medium">Tap on the screen to place points and measure distances</p>
          </div>
          <button className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-2xl pointer-events-auto active:scale-90 transition-all">
            <Plus size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
