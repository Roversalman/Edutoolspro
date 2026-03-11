import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, User, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IDCardGenerator() {
  const { user } = JSON.parse(localStorage.getItem('user') || '{}');
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Digital ID Card</h1>
      </div>

      <div className="flex flex-col items-center gap-8">
        <motion.div 
          ref={cardRef}
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          className="w-full max-w-sm aspect-[1.6/1] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/20"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400 fill-amber-400" size={24} />
              <span className="font-bold tracking-tighter text-lg">EduToolsPro</span>
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Student ID
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <User size={48} className="text-white/40" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-bold leading-tight">{user?.name || 'Student Name'}</h2>
              <p className="text-xs text-white/60 font-mono">{user?.userId || 'E000000'}</p>
              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <p className="text-white/40 uppercase">Class</p>
                  <p className="font-bold">{user?.class || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase">Roll</p>
                  <p className="font-bold">{user?.roll || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <div className="w-12 h-12 bg-white rounded-lg p-1">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${user?.userId}`} alt="QR" />
            </div>
          </div>
        </motion.div>

        <button className="w-full bg-white/5 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all">
          <Download size={20} /> Download ID Card
        </button>
      </div>
    </div>
  );
}
