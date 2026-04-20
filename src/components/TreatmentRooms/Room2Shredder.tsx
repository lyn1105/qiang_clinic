import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Trash2, ArrowDown, Sparkles, Loader2, Users } from 'lucide-react';
import { reframeThought } from '../../services/gemini';
import { NotAlone } from '../NotAlone';

export const Room2Shredder: React.FC = () => {
  const [thought, setThought] = useState('');
  const [reframed, setReframed] = useState<string | null>(null);
  const [isShredding, setIsShredding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleShred = async () => {
    if (!thought.trim() || isShredding) return;

    setIsShredding(true);
    try {
      const result = await reframeThought(thought);
      setReframed(result);
      
      // Simulate Shredding Duration
      setTimeout(() => {
        setIsShredding(false);
        setIsDone(true);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsShredding(false);
    }
  };

  const reset = () => {
    setThought('');
    setReframed(null);
    setIsDone(false);
  };

  return (
    <div className="flex flex-col items-center gap-12 py-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">强子的碎纸机</h2>
        <p className="text-cyber-muted italic">"脑子里那点破事儿，写下来，我给它绞了。"</p>
      </div>

      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div 
            key="input-stage"
            className="w-full space-y-6"
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className={`glass neon-border rounded-2xl p-6 transition-all ${isShredding ? 'opacity-50' : ''}`}>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                disabled={isShredding}
                placeholder="输入那个让你反复纠结、后悔、难受的念头..."
                className="w-full bg-transparent border-none focus:ring-0 text-xl min-h-[150px] resize-none placeholder:text-cyber-muted/30 italic"
              />
            </div>

            <div className="relative flex justify-center h-24">
               {isShredding ? (
                 <div className="flex flex-col items-center gap-4">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="text-cyber-primary"
                    >
                      <Scissors size={48} />
                    </motion.div>
                    <div className="text-xs font-mono uppercase tracking-widest animate-pulse">Shredding Cognitive Distortion...</div>
                 </div>
               ) : (
                 <button
                   onClick={handleShred}
                   disabled={!thought.trim()}
                   className="group relative bg-cyber-primary hover:bg-cyber-primary/80 disabled:bg-cyber-muted/20 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95"
                 >
                   <span className="flex items-center gap-2">
                     碎掉它 <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                   </span>
                 </button>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
          >
            <div className="relative">
               {/* Shredded bits decoration */}
               <div className="absolute -top-12 inset-x-0 flex justify-center gap-2 opacity-40">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: 0 }} 
                      animate={{ y: 20, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 h-8 bg-cyber-muted" 
                    />
                  ))}
               </div>

               <div className="glass neon-border rounded-3xl p-8 space-y-6 bg-gradient-to-br from-cyber-primary/5 to-transparent">
                  <div className="flex items-center gap-2 text-cyber-primary">
                    <Sparkles size={20} />
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">New Perspective Generated</span>
                  </div>
                  
                  <div className="text-2xl font-medium leading-relaxed italic text-cyber-text/90">
                    {reframed?.replace(/\*\*/g, '')}
                  </div>

                  <NotAlone />

                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <p className="text-xs text-cyber-muted italic">"别在那儿反复嚼苦瓜了，换个味儿试试。"</p>
                    <button 
                      onClick={reset}
                      className="text-xs font-bold text-cyber-primary hover:underline"
                    >
                      再碎一个
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs font-mono text-cyber-muted text-center uppercase tracking-widest opacity-40">
        CBT: Cognitive Restructuring Protocol 2.0
      </div>
    </div>
  );
};
