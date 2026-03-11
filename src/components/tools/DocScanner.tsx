import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Download, RefreshCw, FileText, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

export default function DocScanner() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureDoc = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        // Basic image enhancement for "scanned" look
        ctx.filter = 'contrast(1.2) brightness(1.1) grayscale(0.2)';
        ctx.drawImage(canvas, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const exportAsJPG = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `scan-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
  };

  const exportAsPDF = () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    try {
      const pdf = new jsPDF();
      const img = new Image();
      img.src = capturedImage;
      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        pdf.addImage(capturedImage, 'JPEG', 0, 0, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`scan-${Date.now()}.pdf`);
        setIsProcessing(false);
      };
    } catch (err) {
      console.error("PDF Error:", err);
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
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
            Doc Scanner <FileText size={18} className="text-emerald-400" />
          </h1>
        </div>
        {capturedImage && (
          <button onClick={reset} className="p-2 hover:bg-white/5 rounded-full text-emerald-400">
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="relative aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          {!capturedImage ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/20 m-6 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="w-full h-full border border-emerald-500/20 rounded-lg" />
              </div>
              <button 
                onClick={captureDoc}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 p-1 active:scale-90 transition-all shadow-xl"
              >
                <div className="w-full h-full bg-white rounded-full border border-slate-200" />
              </button>
            </>
          ) : (
            <img src={capturedImage} className="w-full h-full object-contain bg-slate-900" alt="Scanned" />
          )}
        </div>

        {capturedImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <button 
              onClick={exportAsJPG}
              className="bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-3 transition-all"
            >
              <ImageIcon className="text-emerald-400" size={32} />
              <span className="font-bold text-sm">Save as JPG</span>
            </button>
            <button 
              onClick={exportAsPDF}
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-600 p-6 rounded-3xl text-black flex flex-col items-center gap-3 transition-all disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={32} /> : <FileText size={32} />}
              <span className="font-bold text-sm">Save as PDF</span>
            </button>
          </motion.div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
