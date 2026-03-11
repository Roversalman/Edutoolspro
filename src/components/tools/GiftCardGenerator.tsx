import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Gift, Sparkles, Check, ChevronDown, FileType, FileImage, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const templates = [
  { id: 'classic', name: 'Classic Gold', bg: 'bg-gradient-to-br from-amber-400 to-amber-600', text: 'text-black' },
  { id: 'modern', name: 'Modern Dark', bg: 'bg-slate-900', text: 'text-emerald-400' },
  { id: 'vibrant', name: 'Vibrant Emerald', bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', text: 'text-black' },
  { id: 'luxury', name: 'Luxury Black', bg: 'bg-black border border-white/20', text: 'text-white' },
];

export default function GiftCardGenerator() {
  const [template, setTemplate] = useState(templates[0]);
  const [amount, setAmount] = useState('100');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('A special gift for you!');
  const [image, setImage] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadAs = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
      const canvas = await html2canvas(cardRef.current, { 
        scale: 3, 
        backgroundColor: null,
        useCORS: true,
        logging: false
      });

      const fileName = `gift-card-${recipient || 'val'}`;

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
      } else {
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = canvas.toDataURL(mimeType, 1.0);
        link.click();
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to generate file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Gift Card Generator <Gift size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-8">
        {/* Preview Area */}
        <div className="flex justify-center">
          <div 
            ref={cardRef}
            className={`w-full max-w-md aspect-[1.6/1] rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden ${template.bg} ${template.text}`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Gift Card</h2>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">EduToolsPro Premium</p>
              </div>
              <Sparkles size={32} className="opacity-40" />
            </div>

            <div className="flex items-center gap-6 relative z-10">
              {image && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-current/20 shadow-lg shrink-0">
                  <img src={image} alt="Subject" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase opacity-60">For</p>
                <p className="text-xl font-bold truncate">{recipient || 'Recipient Name'}</p>
                <p className="text-xs mt-1 opacity-80 italic">"{message}"</p>
              </div>
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60">Value</p>
                <p className="text-4xl font-black tracking-tighter">৳{amount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-60">Code</p>
                <p className="font-mono text-sm tracking-widest">EDU-XXXX-XXXX</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Select Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t)}
                    className={`p-3 rounded-2xl border-2 transition-all text-xs font-bold flex items-center justify-between ${template.id === t.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'}`}
                  >
                    {t.name}
                    {template.id === t.id && <Check size={14} className="text-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Recipient</label>
                <input 
                  type="text" 
                  placeholder="Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Amount (৳)</label>
                <input 
                  type="number" 
                  placeholder="100"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Message</label>
              <textarea 
                placeholder="Short message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Add Photo</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                  <Upload size={18} />
                  <span className="text-sm font-bold">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {image && (
                  <button onClick={() => setImage(null)} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              disabled={isDownloading}
              className="w-full bg-emerald-500 py-4 rounded-2xl font-bold text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download size={20} /> Download Options <ChevronDown size={16} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20"
                >
                  <button onClick={() => downloadAs('png')} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
                    <FileImage size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold">Download as PNG</p>
                      <p className="text-[10px] text-white/40">High quality image</p>
                    </div>
                  </button>
                  <button onClick={() => downloadAs('jpg')} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-t border-white/5">
                    <FileType size={18} className="text-blue-400" />
                    <div>
                      <p className="text-sm font-bold">Download as JPG</p>
                      <p className="text-[10px] text-white/40">Compressed image</p>
                    </div>
                  </button>
                  <button onClick={() => downloadAs('pdf')} className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-t border-white/5">
                    <FileText size={18} className="text-rose-400" />
                    <div>
                      <p className="text-sm font-bold">Download as PDF</p>
                      <p className="text-[10px] text-white/40">Print-ready document</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
