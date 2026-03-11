import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Link as LinkIcon, Copy, Check } from 'lucide-react';

export default function WhatsappLinkCreator() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateLink = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    setLink(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">WhatsApp Link Creator</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone Number (with country code, e.g., 88017...)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Default Message (Optional)"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button 
          onClick={generateLink}
          className="w-full bg-emerald-500 py-4 rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> Generate Link
        </button>

        {link && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/50">Your Link:</span>
              <button onClick={copyToClipboard} className="text-emerald-400 flex items-center gap-1 text-sm">
                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
            <div className="bg-black/20 p-4 rounded-xl break-all font-mono text-xs text-emerald-200">
              {link}
            </div>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              Test Link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
