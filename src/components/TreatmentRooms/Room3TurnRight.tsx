import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, RefreshCw, Footprints, ExternalLink } from 'lucide-react';

const MINI_GOALS = [
  "出门，去最近的便利店买瓶水，跟收银员说声谢谢。",
  "给手机充电线换个插口，顺便擦擦桌子上的灰。",
  "深呼吸一口，去阳台站一分钟，数出三棵你能看到的树。",
  "把你现在穿的袜子脱了，换一双干净的。",
  "打开窗户透气3分钟，不管外面多冷。",
  "喝一杯温水，一小口一小口地吞。",
  "把你手机里最近拍的一张废片删了。"
];

export const Room3TurnRight: React.FC = () => {
  const [goal, setGoal] = useState(MINI_GOALS[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getNewGoal = () => {
    setIsRefreshing(true);
    setIsCompleted(false);
    setTimeout(() => {
      const remaining = MINI_GOALS.filter(g => g !== goal);
      setGoal(remaining[Math.floor(Math.random() * remaining.length)]);
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center gap-12 py-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">强子的出门右转</h2>
        <p className="text-cyber-muted italic">"人生没意义？正常。咱先不谈意义，先动弹动弹。"</p>
      </div>

      <div className="w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={goal}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`glass neon-border rounded-3xl p-10 space-y-8 flex flex-col items-center text-center transition-all ${isCompleted ? 'bg-green-500/10 border-green-500/30' : ''}`}
          >
            <div className={`p-4 rounded-full bg-cyber-bg border border-white/10 ${isCompleted ? 'text-green-500' : 'text-cyber-muted'}`}>
              <Footprints size={40} />
            </div>

            <div className="space-y-4">
               <div className="text-xs font-mono uppercase tracking-widest text-cyber-muted">Today's Mini Activation</div>
               <h3 className="text-2xl font-bold leading-relaxed">{goal}</h3>
            </div>

            <div className="flex flex-col w-full gap-4">
              {!isCompleted ? (
                <button
                  onClick={() => setIsCompleted(true)}
                  className="w-full bg-cyber-primary hover:bg-cyber-primary/80 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  <Circle size={20} /> 说干就干，去做了
                </button>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} /> 完成了，赏自己一次深呼吸
                </motion.div>
              )}

              <button
                onClick={getNewGoal}
                disabled={isRefreshing}
                className="text-xs text-cyber-muted hover:text-cyber-text flex items-center justify-center gap-2 py-2"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} /> 换一个微方针
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
         <AdviceCard 
           title="森田疗法逻辑"
           content="不要等‘有心情’了再去做。心情是跟在行动后面的。先动起来，情绪自然会流动。"
         />
         <AdviceCard 
           title="非评判性觉察"
           content="在执行时，仅仅观察你的动作。水杯的温度、袜子的质感。把注意力从脑袋里拉回到物理世界。"
         />
      </div>

      <div className="text-xs font-mono text-cyber-muted text-center uppercase tracking-widest opacity-40">
        Morita Therapy: Behavioral Activation Protocol
      </div>
    </div>
  );
};

const AdviceCard = ({ title, content }: { title: string, content: string }) => (
  <div className="glass border-white/5 p-4 rounded-xl space-y-2">
    <div className="text-[10px] font-mono text-cyber-primary uppercase tracking-widest font-bold">{title}</div>
    <p className="text-xs leading-relaxed text-cyber-muted">{content}</p>
  </div>
)
