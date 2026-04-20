import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { triageInput } from '../services/gemini';
import { TriageResult } from '../types';
import { SighButton } from './SighButton';
import { QiangziMascot } from './QiangziMascot';

interface CyberTriageProps {
  onComplete: (result: TriageResult) => void;
}

export const CyberTriage: React.FC<CyberTriageProps> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await triageInput(input);
      onComplete(result);
    } catch (err) {
      console.error('Triage failed:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12">
      <div className="flex flex-col items-center">
        <QiangziMascot mood={isLoading ? 'listening' : 'happy'} size={140} className="mb-6" />
        <div className="text-center space-y-4 max-w-2xl font-serif">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/5 border border-cyber-primary/10 text-cyber-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-4"
          >
            <Sparkles size={10} />
            <span>Organic Triage Active</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-cyber-text">
            嗨，老板。<br/>今天哪儿<span className="text-cyber-secondary">不痛快</span>？
          </h2>
          <p className="text-cyber-muted text-lg font-sans">
            别整那些虚头巴脑的测试卷子了。跟强子念叨念叨，<br/>
            怎么着都行，这地儿管够安全。
          </p>
        </div>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl glass neon-border rounded-[2rem] p-3 flex flex-col md:flex-row gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="心里乱？压力大？还是单纯想骂街？在此倾诉..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-xl p-4 resize-none min-h-[140px] placeholder:text-cyber-muted/50 font-serif"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit(e);
            }
          }}
        />
        <div className="flex flex-col justify-end p-2 md:w-32">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full h-full bg-cyber-primary hover:bg-cyber-primary/90 disabled:bg-cyber-muted/20 disabled:cursor-not-allowed text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all p-4 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span className="text-lg font-bold font-mono">SEND</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="w-full max-w-lg flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 w-full opacity-30">
          <div className="h-[1px] flex-1 bg-cyber-muted" />
          <span className="text-[10px] font-mono uppercase tracking-widest">OR</span>
          <div className="h-[1px] flex-1 bg-cyber-muted" />
        </div>

        <SighButton onComplete={onComplete} />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 p-6 glass border-red-400/30 rounded-2xl max-w-xl text-center items-center shadow-2xl shadow-red-900/20"
        >
          <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-1">
            <AlertCircle size={20} />
            <span>强子的服务器开小差了</span>
          </div>
          <p className="text-red-200/70 text-sm leading-relaxed">{error}</p>
          <div className="mt-4 pt-4 border-t border-red-500/10 text-[10px] text-red-400/40 uppercase font-mono tracking-widest flex flex-col gap-1">
            <span>Client ID: 0.4.5-DEPLOYED</span>
            <span>Tip: Clear Cache & Hard Refresh if seeing old errors</span>
          </div>
        </motion.div>
      )}

      <div className="flex gap-8 text-[10px] font-mono text-cyber-muted uppercase tracking-wider opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
          End-to-End Encrypted
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-cyber-secondary" />
           Non-Medical Sanctuary
        </div>
      </div>
    </div>
  );
};
