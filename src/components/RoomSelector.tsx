import React from 'react';
import { motion } from 'motion/react';
import { ROOMS } from '../constants';
import { RoomId, TriageResult } from '../types';
import { ArrowRight, ChevronRight, Users } from 'lucide-react';
import { NotAlone } from './NotAlone';
import { QiangziMascot } from './QiangziMascot';

interface RoomSelectorProps {
  triageResult: TriageResult;
  onRoomSelect: (roomId: RoomId) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({ triageResult, onRoomSelect }) => {
  const recommendedRoom = ROOMS.find(r => r.id === triageResult.recommendedRoom) || ROOMS[0];

  return (
    <div className="space-y-12">
      {/* Triage Feedback */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex gap-6 items-start">
           <QiangziMascot size={100} mood="happy" className="hidden lg:block flex-shrink-0" />
           <div className="space-y-6 flex-1">
             <div className="space-y-2">
                <div className="text-xs font-mono text-cyber-primary uppercase tracking-widest">Triage Analysis</div>
                <h3 className="text-xl md:text-2xl font-medium leading-relaxed italic text-cyber-text/90">
                  "{triageResult.analysis.replace(/\*\*/g, '')}"
                </h3>
                <div className="pt-2">
                  <NotAlone />
                </div>
             </div>
             
             <div className="space-y-4">
                <div className="text-xs font-mono text-cyber-muted uppercase tracking-widest">Mental Telemetry</div>
                <div className="grid grid-cols-1 gap-4">
                   <TelemetryBar label="Cognition (认知反刍)" value={triageResult.state.cognition} color="bg-cyber-primary" />
                   <TelemetryBar label="Emotion (情绪激活)" value={triageResult.state.emotion + 50} color="bg-cyber-secondary" max={100} />
                   <TelemetryBar label="Physiology (生理紧绷)" value={triageResult.state.physiology} color="bg-stone-500" />
                </div>
             </div>
           </div>
        </div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass neon-border rounded-[2.5rem] p-8 bg-gradient-to-br from-cyber-primary/5 to-transparent"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-cyber-primary uppercase tracking-widest mb-2 font-bold">Recommended for you</div>
                <h4 className="text-2xl font-bold">{recommendedRoom.name}</h4>
              </div>
              <div className={`p-4 rounded-2xl bg-white/20 border border-white/40 ${recommendedRoom.color}`}>
                <recommendedRoom.icon size={32} />
              </div>
            </div>
            <p className="text-cyber-text/80 text-sm leading-relaxed">{recommendedRoom.description}</p>
            <button 
              onClick={() => onRoomSelect(recommendedRoom.id)}
              className="w-full bg-cyber-primary hover:bg-cyber-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              立刻进入治疗室 <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Other Rooms */}
      <div className="space-y-6">
        <div className="text-xs font-mono text-cyber-muted uppercase tracking-widest text-center">Or explore other sectors</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className="glass hover:bg-white/10 transition-colors rounded-2xl p-6 flex flex-col gap-4 text-left group"
            >
              <div className={`p-2 rounded-lg bg-cyber-bg border border-white/10 w-fit ${room.color}`}>
                <room.icon size={24} />
              </div>
              <div>
                <div className="font-bold">{room.name}</div>
                <div className="text-xs text-cyber-muted mt-1">{room.enName}</div>
              </div>
              <ChevronRight size={16} className="text-cyber-muted group-hover:translate-x-1 transition-transform ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TelemetryBar = ({ label, value, color, max = 100 }: { label: string, value: number, color: string, max?: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest opacity-60">
      <span>{label}</span>
      <span>{Math.round((value / max) * 100)}%</span>
    </div>
    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
        className={`h-full ${color} opacity-80`} 
      />
    </div>
  </div>
);
