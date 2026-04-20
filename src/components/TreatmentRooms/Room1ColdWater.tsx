import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Circle, Play, Pause, RotateCcw } from 'lucide-react';

export const Room1ColdWater: React.FC = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(4);

  const PHASES = {
    inhale: { text: '吸气 / Inhale', duration: 4, next: 'hold' as const, color: 'text-cyber-primary' },
    hold: { text: '屏息 / Hold', duration: 4, next: 'exhale' as const, color: 'text-stone-500' },
    exhale: { text: '呼气 / Exhale', duration: 4, next: 'pause' as const, color: 'text-cyber-secondary' },
    pause: { text: '停顿 / Pause', duration: 4, next: 'inhale' as const, color: 'text-stone-400' },
  };

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            const nextPhase = PHASES[phase].next;
            setPhase(nextPhase);
            return PHASES[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(4);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">强子的冷水盆</h2>
        <p className="text-cyber-muted italic">"不管多大的火气，兜头一盆冷水，先匀速呼吸。"</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Breathing Circle */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={phase}
            initial={{ scale: phase === 'inhale' ? 0.8 : 1.2 }}
            animate={{ 
              scale: phase === 'inhale' ? 1.5 : (phase === 'exhale' ? 0.8 : (phase === 'hold' ? 1.5 : 0.8)),
              opacity: isActive ? 1 : 0.3
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className={`absolute w-full h-full rounded-full border-4 border-current ${PHASES[phase].color} shadow-[0_0_50px_currentColor] opacity-20`}
          />
        </AnimatePresence>

        <div className="relative z-10 text-center space-y-2">
          <motion.div 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-bold font-mono tracking-wider ${PHASES[phase].color}`}
          >
            {PHASES[phase].text}
          </motion.div>
          <div className="text-5xl font-black font-mono">{timer}</div>
        </div>

        {/* Ambient Particles */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [-20, 20],
                  x: [-20, 20],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                className="absolute w-1 h-1 bg-white rounded-full bg-blue-300/30"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="w-16 h-16 rounded-full glass border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isActive ? <Pause /> : <Play className="ml-1" />}
        </button>
        <button 
          onClick={reset}
          className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-cyber-muted hover:text-cyber-text transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="max-w-md text-center text-sm text-cyber-muted leading-relaxed">
        这个方法叫博克斯呼吸法（Box Breathing）。<br/>
        让你的横膈膜有节奏地扩张和收缩，<br/>
        直接通过迷走神经告诉你的大脑：<b>“现在没仗打，可以放松。”</b>
      </div>
    </div>
  );
};
