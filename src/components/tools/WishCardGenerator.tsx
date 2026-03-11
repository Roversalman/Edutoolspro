import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Heart, PartyPopper, Users, TrendingUp, Check, ChevronDown, FileType, FileImage, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const categories = [
  { id: 'birthday', name: 'Birthday', icon: <PartyPopper size={16} />, color: 'from-pink-500 to-rose-600', text: 'Happy Birthday!' },
  { id: 'anniversary', name: 'Anniversary', icon: <Heart size={16} />, color: 'from-red-500 to-rose-700', text: 'Happy Anniversary!' },
  { id: 'reunion', name: 'Reunion', icon: <Users size={16} />, color: 'from-blue-500 to-indigo-600', text: 'Great to See You!' },
  { id: 'promotion', name: 'Promotion', icon: <TrendingUp size={16} />, color: 'from-emerald-500 to-teal-600', text: 'Congratulations!' },
];

export default function WishCardGenerator() {
  const [category, setCategory] = useState(categories[0]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('Wishing you all the best on this special day!');
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

      const fileName = `wish-card-${category.id}-${recipient || 'val'}`;

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
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
          Wish Card Generator <Heart size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-8">
        {/* Category Selector */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat)}
              className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${category.id === cat.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="flex justify-center">
          <div 
            ref={cardRef}
            className={`w-full max-w-sm aspect-[3/4] rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden bg-gradient-to-b ${category.color} text-white`}
          >
            <div className="relative z-10 space-y-6 flex flex-col items-center h-full justify-between">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                  {category.icon}
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter leading-none">{category.text}</h2>
                <p className="text-sm font-bold opacity-80 uppercase tracking-[0.2em]">{recipient || 'Recipient Name'}</p>
              </div>

              {image ? (
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl shrink-0">
                  <img src={image} alt="Subject" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-dashed border-white/20 flex items-center justify-center text-white/20">
                  <Upload size={32} />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-lg font-medium leading-relaxed italic px-4">"{message}"</p>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">EduToolsPro Wishes</p>
                </div>
              </div>
            </div>

            {/* Decorative Ornaments */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Recipient Name</label>
              <input 
                type="text" 
                placeholder="Who is this for?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Your Message</label>
              <textarea 
                placeholder="Write something heartfelt..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Add Subject Photo</label>
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
