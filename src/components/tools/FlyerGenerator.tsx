import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, FileText, Sparkles, Check, Calendar, MapPin, Info, ChevronDown, FileType, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const templates = [
  { id: 'event', name: 'Event Flyer', bg: 'bg-emerald-500', text: 'text-black', accent: 'bg-black' },
  { id: 'promo', name: 'Promotion', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-emerald-500' },
  { id: 'modern', name: 'Modern Clean', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-emerald-500' },
  { id: 'bold', name: 'Bold Dark', bg: 'bg-black', text: 'text-emerald-400', accent: 'bg-emerald-500' },
];

export default function FlyerGenerator() {
  const [template, setTemplate] = useState(templates[0]);
  const [data, setData] = useState({
    title: 'GRAND EVENT 2024',
    subtitle: 'Join us for an amazing experience',
    date: 'March 25, 2024',
    location: 'Main Auditorium, EduToolsPro',
    description: 'A special gathering for all students and educators to celebrate academic excellence and innovation.'
  });
  const [image, setImage] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
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
    if (!flyerRef.current) return;
    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
      const canvas = await html2canvas(flyerRef.current, { 
        scale: 2, 
        backgroundColor: null,
        useCORS: true,
        logging: false
      });

      const fileName = `flyer-${data.title}`;

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
          Flyer Generator <FileText size={20} className="text-emerald-400" />
        </h1>
      </div>

      <div className="space-y-8">
        {/* Preview Area */}
        <div className="flex justify-center">
          <div 
            ref={flyerRef}
            className={`w-full max-w-sm aspect-[1/1.414] rounded-3xl p-10 flex flex-col shadow-2xl relative overflow-hidden ${template.bg} ${template.text}`}
          >
            <div className="relative z-10 space-y-6 flex flex-col h-full">
              <div className="space-y-2">
                <div className={`w-12 h-1 ${template.accent} rounded-full mb-4`}></div>
                <h2 className="text-4xl font-black tracking-tighter leading-none uppercase break-words">{data.title}</h2>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{data.subtitle}</p>
              </div>

              {image && (
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-current/10 shadow-2xl shrink-0">
                  <img src={image} alt="Subject" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1 space-y-4">
                <p className="text-sm font-medium leading-relaxed opacity-80">{data.description}</p>
                
                <div className="space-y-2 pt-4 border-t border-current/10">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <Calendar size={16} className="opacity-60" />
                    <span>{data.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <MapPin size={16} className="opacity-60" />
                    <span className="truncate">{data.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase opacity-60">Organized by</p>
                  <p className="text-xs font-black tracking-tighter uppercase">EduToolsPro</p>
                </div>
                <Sparkles size={24} className="opacity-40" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 ${template.accent} opacity-10 rounded-full blur-3xl`}></div>
            <div className={`absolute -left-20 -bottom-20 w-64 h-64 ${template.accent} opacity-10 rounded-full blur-3xl`}></div>
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

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Main Title</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Date</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/40 uppercase">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Flyer Image</label>
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
