import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Search } from 'lucide-react';
import { io } from 'socket.io-client';

// Use the context from App.tsx if possible, but for now we'll use a local one or props
// Actually, I'll just use the localStorage as it was doing, but update the theme.

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit('join', user.id);

    newSocket.on('receive_message', (data: any) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input || !socket) return;
    const data = {
      sender_id: user.id,
      receiver_id: 1, // Defaulting to admin
      content: input,
      timestamp: new Date().toISOString()
    };
    socket.emit('send_message', data);
    setMessages(prev => [...prev, data]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="p-6 border-b border-white/10 flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Support Chat</h1>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender_id === user.id 
                ? 'bg-emerald-500 text-black rounded-tr-none' 
                : 'bg-white/10 text-white rounded-tl-none'
            }`}>
              <p className="text-sm font-medium">{msg.content}</p>
              <span className={`text-[10px] block mt-1 ${msg.sender_id === user.id ? 'text-black/40' : 'text-white/40'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="p-3 bg-emerald-500 rounded-xl text-black active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
