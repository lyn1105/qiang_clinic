import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Sparkles, Loader2, RefreshCw, Scale, Users } from 'lucide-react';
import { nameMonster } from '../../services/gemini';
import { Monster } from '../../types';
import { NotAlone } from '../NotAlone';

export const Room4Monster: React.FC = () => {
  const [description, setDescription] = useState('');
  const [monster, setMonster] = useState<Monster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentify = async () => {
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await nameMonster(description);
      setMonster(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setDescription('');
    setMonster(null);
  };

  return (
    <div className="flex flex-col items-center gap-12 py-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">怪兽命名馆</h2>
        <p className="text-cyber-muted italic">"那些说不清道不明的难受，其实就是一群调皮的小畜生。"</p>
      </div>

      <AnimatePresence mode="wait">
        {!monster ? (
          <motion.div 
            key="input"
            className="w-full space-y-6"
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="glass neon-border rounded-2xl p-6">
              <label className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest block mb-4">Describe the uncomfortable feeling</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="它像什么？是堵在胸口的一团棉花？还是在脑袋里钻洞的响尾蛇？"
                className="w-full bg-transparent border-none focus:ring-0 text-xl min-h-[150px] resize-none placeholder:text-cyber-muted/30 italic"
              />
            </div>

            <button
              onClick={handleIdentify}
              disabled={!description.trim() || isLoading}
              className="w-full group bg-cyber-secondary hover:bg-cyber-secondary/80 disabled:bg-cyber-muted/20 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  辨认这个怪物 <Ghost size={20} className="group-hover:animate-bounce" />
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="monster-card"
            initial={{ opacity: 0, y: 40, rotateY: 90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            className="w-full"
          >
            <div className="glass neon-border rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              {/* Header */}
              <div className="bg-cyber-secondary p-6 text-white flex justify-between items-center bg-gradient-to-r from-cyber-secondary to-cyber-secondary/80">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-80">Newly Named Creature</div>
                  <h3 className="text-3xl font-black italic">{monster.name.replace(/\*\*/g, '')}</h3>
                  <div className="mt-2 text-white">
                    <NotAlone className="text-white/80 bg-white/10 border-white/10" />
                  </div>
                </div>
                <Ghost size={48} className="opacity-30" />
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest font-bold">Physical Form</label>
                          <p className="text-sm italic">{monster.description.replace(/\*\*/g, '')}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1 border-l-2 border-cyber-secondary pl-3">
                          <label className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest font-bold">Naughty Habit</label>
                          <p className="text-xs">{monster.trait}</p>
                       </div>
                       <div className="space-y-1 border-l-2 border-cyber-secondary pl-3">
                          <label className="text-[10px] font-mono text-cyber-muted uppercase tracking-widest font-bold">Attack Style</label>
                          <p className="text-xs">{monster.power}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 bg-black/5 rounded-xl text-xs leading-relaxed text-cyber-muted">
                    <b>叙事疗法提醒：</b>你只是它的宿主，并不是它。现在这个怪物有了名字，它就不再是那个无法控制的庞然大物。试着在它闹腾的时候跟它打个招呼：‘嘿，{monster.name}，你又在玩那一套了？’
                 </div>

                 <button 
                   onClick={reset}
                   className="w-full py-3 border border-black/5 rounded-xl text-xs font-mono text-cyber-muted hover:bg-black/5 transition-colors flex items-center justify-center gap-2"
                 >
                   <RefreshCw size={12} /> 重新命名一个情绪
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs font-mono text-cyber-muted text-center uppercase tracking-widest opacity-40">
        Narrative Therapy: Externalization Protocol
      </div>
    </div>
  );
};
