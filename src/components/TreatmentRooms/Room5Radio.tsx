import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Volume2, VolumeX, Loader2, Thermometer, CloudRain, Sun, Wind, MapPin } from 'lucide-react';
import { generateRadioScript, textToSpeech } from '../../services/gemini';

export const Room5Radio: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [script, setScript] = useState('');
  const [location, setLocation] = useState({ city: '某座城市', weather: '宁静' });
  const [isMuted, setIsMuted] = useState(false);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Try to get geolocation and weather vibe
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In a real app we'd use lat/lng to get weather.
          // For now, let's set some comforting defaults or simulate sensing.
          const hour = new Date().getHours();
          const isNight = hour > 19 || hour < 6;
          setLocation({
            city: '现在的城市',
            weather: isNight ? '月色柔和' : '微风徐徐'
          });
        },
        () => {
          console.log("Location access denied.");
        }
      );
    }
  }, []);

  const playPCM = (base64: string) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    
    const pcm = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 32768.0;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    
    source.onended = () => {
       setIsPlayingAudio(false);
    };
  };

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      if (ambienceRef.current) ambienceRef.current.pause();
    }
  }, [status]);

  const startBroadcast = async () => {
    setStatus('loading');
    try {
      const newScript = await generateRadioScript(location.city, location.weather);
      setScript(newScript);
      
      const audioBase64 = await textToSpeech(newScript);
      if (audioBase64) {
        // Start ambience
        if (ambienceRef.current) {
          ambienceRef.current.volume = 0.15;
          ambienceRef.current.play();
        }
        
        setStatus('playing');
        setIsPlayingAudio(true);
        playPCM(audioBase64);
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (ambienceRef.current) ambienceRef.current.muted = !isMuted;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 py-8 relative overflow-hidden">
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-black" />
        <AnimatePresence>
          {status === 'playing' && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute inset-0"
             >
               {[...Array(20)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     y: [0, 1000],
                     opacity: [0, 0.5, 0]
                   }}
                   transition={{ 
                     duration: 2 + Math.random() * 2,
                     repeat: Infinity,
                     delay: Math.random() * 2
                   }}
                   className="absolute w-[1px] h-20 bg-pink-400"
                   style={{ left: `${Math.random() * 100}%`, top: '-10%' }}
                 />
               ))}
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-4 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/5 border border-pink-500/10 text-pink-400 text-[10px] font-mono uppercase tracking-[0.2em]">
          <Radio size={12} className={status === 'playing' ? 'animate-pulse' : ''} />
          <span>Qiangzi Midnight Radio • FM 104.8</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight">强子的深夜电台</h2>
        <p className="max-w-md mx-auto text-cyber-muted italic leading-relaxed">
          “老板，你是不是还没睡呀？<br/>
          我就坐在这儿陪你，咱们一起听听雨声好不好？”
        </p>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                <ContextPill icon={MapPin} label="城市" value={location.city} />
                <ContextPill icon={CloudRain} label="天气" value={location.weather} />
              </div>
              
              <button
                onClick={startBroadcast}
                className="w-24 h-24 rounded-full bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(236,72,153,0.4)] group"
              >
                <Volume2 size={32} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="text-xs font-mono text-pink-500/60 uppercase tracking-widest">Click to start companionship</div>
            </motion.div>
          ) : (
            <motion.div 
              key="broadcasting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex justify-center items-end gap-1 h-32">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: status === 'playing' ? [20, 80, 40, 100, 20] : 10,
                    }}
                    transition={{ 
                      duration: 0.8 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-gradient-to-t from-pink-500 to-cyber-secondary rounded-full"
                  />
                ))}
              </div>

              <div className="glass neon-border rounded-3xl p-8 bg-black/20 relative overflow-hidden group">
                 <div className="absolute top-4 right-4">
                   <button onClick={toggleMute} className="text-pink-400 hover:text-pink-300">
                     {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                   </button>
                 </div>
                 {status === 'loading' ? (
                   <div className="flex flex-col items-center py-12 gap-4">
                     <Loader2 className="animate-spin text-pink-500" size={32} />
                     <p className="text-xs font-mono text-cyber-muted animate-pulse">Qiangzi is warming up the mic...</p>
                   </div>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-6"
                   >
                     <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-cyber-text/90 text-center">
                       “{script}”
                     </p>
                     <div className="flex justify-center border-t border-white/5 pt-6">
                        <button 
                          onClick={() => setStatus('idle')}
                          className="text-xs font-mono text-cyber-muted hover:text-pink-400 transition-colors uppercase tracking-widest"
                        >
                          End Broadcast
                        </button>
                     </div>
                   </motion.div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <audio 
        ref={ambienceRef} 
        loop 
        src="https://www.soundjay.com/nature/rain-01.mp3" 
      />

      <div className="text-xs font-mono text-cyber-muted text-center uppercase tracking-widest opacity-40 z-10">
        Hypnotherapy: Auditory Resonance Protocol
      </div>
    </div>
  );
};

const ContextPill = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="glass border-white/5 p-3 rounded-xl flex items-center gap-3">
    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
      <Icon size={14} />
    </div>
    <div className="text-left">
      <div className="text-[9px] font-mono uppercase text-cyber-muted">{label}</div>
      <div className="text-xs font-bold whitespace-nowrap">{value}</div>
    </div>
  </div>
);
