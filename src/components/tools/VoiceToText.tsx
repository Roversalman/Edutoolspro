import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Copy, Check } from 'lucide-react';

export default function VoiceToText() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setText(prev => prev + finalTranscript);
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Voice to Text</h1>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            readOnly
            placeholder="Your speech will appear here..."
            className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
            value={text}
          />
          {text && (
            <button onClick={copy} className="absolute bottom-4 right-4 p-2 bg-white/10 rounded-lg text-white/60">
              {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`}
          >
            {isListening ? <MicOff size={40} /> : <Mic size={40} />}
          </button>
          <p className="text-sm text-white/40">
            {isListening ? 'Listening... Speak clearly' : 'Tap the mic to start speaking'}
          </p>
        </div>

        {text && (
          <button onClick={() => setText('')} className="w-full py-3 text-white/40 text-sm">Clear Text</button>
        )}
      </div>
    </div>
  );
}
