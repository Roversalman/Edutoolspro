import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator as CalcIcon, History, Trash2, Delete, RotateCcw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluate } from 'mathjs';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleInput = (val: string) => {
    if (display === 'Error') {
      setDisplay(val);
      return;
    }
    
    if (display === '0' && !isNaN(Number(val))) {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const backspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      // Replace symbols for mathjs
      let expr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/e/g, 'e')
        .replace(/√\(/g, 'sqrt(');
      
      const result = evaluate(expr);
      const formattedResult = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
      
      setHistory(prev => [{ expr: display, res: formattedResult }, ...prev].slice(0, 20));
      setExpression(display + ' =');
      setDisplay(formattedResult);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const addFunction = (fn: string) => {
    if (display === '0') setDisplay(fn + '(');
    else setDisplay(prev => prev + fn + '(');
  };

  const buttons = [
    { label: 'C', action: clear, type: 'clear' },
    { label: '(', action: () => handleInput('('), type: 'op' },
    { label: ')', action: () => handleInput(')'), type: 'op' },
    { label: '÷', action: () => handleInput('÷'), type: 'op' },
    
    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '×', action: () => handleInput('×'), type: 'op' },
    
    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '-', action: () => handleInput('-'), type: 'op' },
    
    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '+', action: () => handleInput('+'), type: 'op' },
    
    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: '⌫', action: backspace, type: 'num' },
    { label: '=', action: calculate, type: 'equal' },
  ];

  const scientificButtons = [
    { label: 'sin', action: () => addFunction('sin'), type: 'sci' },
    { label: 'cos', action: () => addFunction('cos'), type: 'sci' },
    { label: 'tan', action: () => addFunction('tan'), type: 'sci' },
    { label: 'deg', action: () => handleInput('deg'), type: 'sci' },
    
    { label: 'log', action: () => addFunction('log10'), type: 'sci' },
    { label: 'ln', action: () => addFunction('log'), type: 'sci' },
    { label: '√', action: () => addFunction('sqrt'), type: 'sci' },
    { label: '^', action: () => handleInput('^'), type: 'sci' },
    
    { label: 'π', action: () => handleInput('π'), type: 'sci' },
    { label: 'e', action: () => handleInput('e'), type: 'sci' },
    { label: '!', action: () => handleInput('!'), type: 'sci' },
    { label: '%', action: () => handleInput('%'), type: 'sci' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            Scientific Calc <CalcIcon size={18} className="text-rose-500" />
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-rose-500 text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <History size={20} />
          </button>
          <button 
            onClick={() => setIsScientific(!isScientific)}
            className={`p-2 rounded-full transition-colors ${isScientific ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        {/* Display Area */}
        <div className="bg-slate-900/50 rounded-3xl p-8 mb-6 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="text-right text-rose-400/60 text-sm font-mono h-6 mb-2 tracking-wider truncate">{expression}</div>
          <div className="text-right text-5xl font-bold font-mono overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
            {display}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-900/80 rounded-2xl border border-white/5 overflow-hidden mb-4"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">History</span>
                  <button onClick={() => setHistory([])} className="text-rose-400 hover:text-rose-300 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={scrollRef}>
                  {history.length === 0 ? (
                    <p className="text-center text-white/20 text-xs py-4 italic">No history yet</p>
                  ) : (
                    history.map((item, i) => (
                      <div key={i} className="text-right group cursor-pointer" onClick={() => setDisplay(item.res)}>
                        <div className="text-[10px] text-white/30 group-hover:text-rose-400/50 transition-colors">{item.expr}</div>
                        <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">= {item.res}</div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scientific Controls */}
          <AnimatePresence>
            {isScientific && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-4 gap-3 mb-2"
              >
                {scientificButtons.map(btn => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className="p-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/5"
                  >
                    {btn.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Keypad */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={cn(
                  "p-5 rounded-2xl text-xl font-bold transition-all active:scale-95 border border-white/5 shadow-lg",
                  btn.type === 'clear' ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20" :
                  btn.type === 'equal' ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20" :
                  btn.type === 'op' ? "bg-white/10 text-rose-400 hover:bg-white/20" :
                  "bg-white/5 hover:bg-white/10 text-white/80"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
          Advanced Scientific Engine • MathJS v14.0
        </p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
