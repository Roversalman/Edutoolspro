import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar } from 'lucide-react';

export default function NoticeboardPopup({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/notices')
        .then(res => res.json())
        .then(data => setNotices(data));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative max-h-[80vh] flex flex-col"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bell className="text-amber-400" /> Noticeboard
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {notices.length > 0 ? notices.map(notice => (
                <div key={notice.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-indigo-300">{notice.title}</h3>
                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                      <Calendar size={10} /> {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{notice.content}</p>
                </div>
              )) : (
                <div className="text-center py-12 text-white/20">
                  <Bell size={48} className="mx-auto mb-4 opacity-10" />
                  <p>No notices at the moment</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
