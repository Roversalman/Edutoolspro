import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Play, Square, Settings } from 'lucide-react';

export default function TextToVoice() {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const navigate = useNavigate();

  const speak = () => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Text to Voice</h1>
      </div>

      <div className="space-y-6">
        <textarea
          placeholder="Enter text to convert to speech..."
          className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-white/40 flex justify-between">
              Speed <span>{rate}x</span>
            </label>
            <input 
              type="range" min="0.5" max="2" step="0.1" 
              value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/40 flex justify-between">
              Pitch <span>{pitch}</span>
            </label>
            <input 
              type="range" min="0.5" max="2" step="0.1" 
              value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={speaking ? stop : speak}
            className={`flex-1 py-4 rounded-2xl font-bold shadow-lg active:scale-95 flex items-center justify-center gap-2 ${speaking ? 'bg-rose-500' : 'bg-indigo-500'}`}
          >
            {speaking ? <><Square size={20} /> Stop</> : <><Play size={20} /> Speak</>}
          </button>
        </div>
      </div>
    </div>
  );
}
