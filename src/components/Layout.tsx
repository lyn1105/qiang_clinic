import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Info } from 'lucide-react';
import { RoomId } from '../types';
import { QiangziMascot } from './QiangziMascot';

interface LayoutProps {
  children: React.ReactNode;
  activeRoom: RoomId;
  onNavigate: (room: RoomId) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeRoom, onNavigate }) => {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col overflow-hidden Selection:bg-cyber-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] bg-cyber-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[40%] h-[40%] bg-cyber-secondary/20 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-black/5 px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('triage')}
        >
          <QiangziMascot size={48} className="transition-transform group-hover:scale-110" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-cyber-text">强子心理诊所</h1>
            <p className="text-[10px] uppercase tracking-widest text-cyber-muted font-mono">Organic Sanctuary v1.0</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('triage')}
            className={`p-2 transition-colors ${activeRoom === 'triage' ? 'text-cyber-primary' : 'text-cyber-muted hover:text-cyber-text'}`}
          >
            <Home size={20} />
          </button>
          <button className="text-cyber-muted hover:text-cyber-text transition-colors">
            <Info size={20} />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoom}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-5xl mx-auto px-6 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.1]" 
           style={{ backgroundImage: 'radial-gradient(var(--color-cyber-primary) 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }} />
    </div>
  );
};
