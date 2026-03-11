import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Rotate3d, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: string;
  front: string;
  back: string;
}

export default function Flashcards() {
  const [cards, setCards] = useState<Card[]>([
    { id: '1', front: 'What is Photosynthesis?', back: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.' },
    { id: '2', front: 'Who wrote "Hamlet"?', back: 'William Shakespeare' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const navigate = useNavigate();

  const addCard = () => {
    if (!newFront || !newBack) return;
    setCards([...cards, { id: Math.random().toString(), front: newFront, back: newBack }]);
    setNewFront('');
    setNewBack('');
  };

  const deleteCard = (id: string) => {
    const newCards = cards.filter(c => c.id !== id);
    setCards(newCards);
    if (currentIndex >= newCards.length) setCurrentIndex(Math.max(0, newCards.length - 1));
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Flashcards</h1>
        </div>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isEditMode ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/60'}`}
        >
          {isEditMode ? 'Done' : 'Edit Deck'}
        </button>
      </div>

      {!isEditMode ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          {cards.length > 0 ? (
            <>
              <div className="w-full max-w-sm perspective-1000 h-80 relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div 
                  className="w-full h-full relative preserve-3d transition-all duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest absolute top-6">Question</span>
                    <p className="text-xl font-bold leading-relaxed">{cards[currentIndex].front}</p>
                    <div className="absolute bottom-6 flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase">
                      <Rotate3d size={14} /> Tap to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-emerald-500 border border-emerald-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl rotate-y-180 text-black">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest absolute top-6">Answer</span>
                    <p className="text-xl font-bold leading-relaxed">{cards[currentIndex].back}</p>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center gap-8">
                <button onClick={prevCard} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><ChevronLeft /></button>
                <div className="text-sm font-bold text-white/40">
                  {currentIndex + 1} <span className="mx-1">/</span> {cards.length}
                </div>
                <button onClick={nextCard} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all"><ChevronRight /></button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <Sparkles size={48} className="text-white/10 mx-auto" />
              <p className="text-white/40">No cards in your deck yet.</p>
              <button onClick={() => setIsEditMode(true)} className="text-emerald-400 font-bold">Create your first card</button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Add New Card</h3>
            <div className="space-y-3">
              <textarea 
                placeholder="Question (Front)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
              />
              <textarea 
                placeholder="Answer (Back)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
              />
              <button 
                onClick={addCard}
                className="w-full bg-emerald-500 py-4 rounded-2xl font-bold text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Add to Deck
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Current Deck ({cards.length})</h3>
            {cards.map((card) => (
              <div key={card.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                <div className="flex-1 pr-4 truncate">
                  <p className="font-bold text-sm truncate">{card.front}</p>
                  <p className="text-xs text-white/40 truncate">{card.back}</p>
                </div>
                <button onClick={() => deleteCard(card.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
