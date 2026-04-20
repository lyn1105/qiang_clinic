import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

export const NotAlone: React.FC<{ className?: string }> = ({ className }) => {
  // Generate a plausible number of "people tonight"
  const count = useMemo(() => Math.floor(Math.random() * 3000) + 1200, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-black/5 text-base font-sans ${className || 'text-cyber-muted'}`}
    >
      <Users size={20} className={className?.includes('text-white') ? 'text-white/60' : 'text-cyber-primary'} />
      <span>
        今晚，有 <span className={`font-bold font-mono ${className?.includes('text-white') ? 'text-white' : 'text-cyber-primary'}`}>{count}</span> 个人和你一样，意思就是你不是一个人。
      </span>
    </motion.div>
  );
};
