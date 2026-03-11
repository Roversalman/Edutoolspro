import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Scissors, Merge, Split, FileText } from 'lucide-react';

export default function PDFTools() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'merge' | 'split' | 'toImg'>('merge');
  const navigate = useNavigate();

  const handleProcess = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`${mode.toUpperCase()} completed! (Simulation)`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">PDF Tools</h1>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setMode('merge')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'merge' ? 'bg-indigo-500' : ''}`}
          >
            Merge
          </button>
          <button 
            onClick={() => setMode('split')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'split' ? 'bg-indigo-500' : ''}`}
          >
            Split
          </button>
          <button 
            onClick={() => setMode('toImg')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'toImg' ? 'bg-indigo-500' : ''}`}
          >
            To Image
          </button>
        </div>

        <div className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative">
          {file ? (
            <div className="text-center space-y-2">
              <FileText size={48} className="text-rose-400 mx-auto" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <>
              <FileText size={48} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm">Upload PDF File</p>
            </>
          )}
          <input 
            type="file" 
            accept=".pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button 
          onClick={handleProcess}
          disabled={loading || !file}
          className="w-full bg-indigo-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : <><Download size={20} /> Process PDF</>}
        </button>

        <div className="bg-white/5 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Features</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Merge size={14} /> Combine multiple PDFs
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Split size={14} /> Extract specific pages
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <FileText size={14} /> Compress size
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Scissors size={14} /> Rotate pages
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
