import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Download, Share2 } from 'lucide-react';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const navigate = useNavigate();

  const generate = () => {
    if (!text) return;
    // Using a public QR API for simplicity
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    setQrUrl(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">QR Generator</h1>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Enter URL or Text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={generate}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <QrCode size={20} /> Generate QR Code
        </button>

        {qrUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
            </div>
            
            <div className="flex gap-4 w-full">
              <button className="flex-1 bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2">
                <Download size={18} /> Download
              </button>
              <button className="flex-1 bg-white/5 py-3 rounded-xl flex items-center justify-center gap-2">
                <Share2 size={18} /> Share
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
