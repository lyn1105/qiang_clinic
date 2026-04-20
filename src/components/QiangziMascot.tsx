import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface QiangziMascotProps {
  size?: number;
  className?: string;
  mood?: 'happy' | 'thinking' | 'listening' | 'cheering';
}

export const QiangziMascot: React.FC<QiangziMascotProps> = ({ 
  size = 120, 
  className = "", 
  mood = 'happy' 
}) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Soft Pink/Cyan Ambient Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-pink-400/20 blur-2xl" 
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(255,100,200,0.3)]"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="35" ry="8" fill="black" fillOpacity="0.1" />

        {/* Long Hair - Back Layer */}
        <path
          d="M40 80C40 80 30 130 45 160C60 190 140 190 155 160C170 130 160 80 160 80H40Z"
          fill="#332244"
        />

        {/* Body / Medical Outfit (Cute Dress style) */}
        <motion.path
          d="M65 140C65 130 75 125 100 125C125 125 135 130 135 140L145 180H55L65 140Z"
          fill="white"
          animate={mood === 'cheering' ? { y: [0, -4, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
        {/* Neon Pink Accents on Outfit */}
        <path d="M100 125V180" stroke="#FF007A" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
        <circle cx="100" cy="145" r="4" fill="#FF007A" opacity="0.8" />
        
        {/* Tiny Arms */}
        <motion.path 
          d="M65 145L45 155" 
          stroke="white" 
          strokeWidth="10" 
          strokeLinecap="round" 
          animate={mood === 'cheering' ? { rotate: [0, -40, 0] } : {}}
        />
        <motion.path 
          d="M135 145L155 155" 
          stroke="white" 
          strokeWidth="10" 
          strokeLinecap="round" 
          animate={mood === 'cheering' ? { rotate: [0, 40, 0] } : {}}
        />

        {/* Head Gp */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hair - Main Volume */}
          <path
            d="M50 80C50 40 75 20 100 20C125 20 150 40 150 80V110C150 125 130 145 100 145C70 145 50 125 50 110V80Z"
            fill="#443355"
          />

          {/* Face */}
          <path
            d="M62 85C62 68 76 58 100 58C124 58 138 68 138 85V110C138 128 124 138 100 138C76 138 62 128 62 110V85Z"
            fill="#FFF5F0"
          />

          {/* Cute Large Doll Eyes */}
          <g className="eyes">
            {/* Left */}
            <circle cx="85" cy="98" r="11" fill="#221133" />
            <circle cx="82" cy="94" r="4" fill="white" />
            <circle cx="88" cy="102" r="2" fill="white" opacity="0.6" />
            {/* Right */}
            <circle cx="115" cy="98" r="11" fill="#221133" />
            <circle cx="112" cy="94" r="4" fill="white" />
            <circle cx="118" cy="102" r="2" fill="white" opacity="0.6" />
          </g>

          {/* Soft Heart Blushes */}
          <path d="M72 110Q75 107 78 110Q81 107 84 110T78 116T72 110" fill="#FF80AB" fillOpacity="0.4" />
          <path d="M116 110Q119 107 122 110Q125 107 128 110T122 116T116 110" fill="#FF80AB" fillOpacity="0.4" />

          {/* Smile */}
          <motion.path
            d={mood === 'happy' || mood === 'cheering' ? "M95 120C95 120 100 124 105 120" : "M97 122H103"}
            stroke="#443355"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Bangs / Front Hair */}
          <path
            d="M50 80C50 50 70 35 100 35C130 35 150 50 150 80C140 65 120 60 100 60C80 60 60 65 50 80Z"
            fill="#443355"
          />
          {/* Side Hair Strands */}
          <path d="M50 80C40 100 45 130 55 140" stroke="#443355" strokeWidth="8" strokeLinecap="round" />
          <path d="M150 80C160 100 155 130 145 140" stroke="#443355" strokeWidth="8" strokeLinecap="round" />

          {/* Cyber Headpiece (Cute Ribbon/Bow style) */}
          <g transform="translate(140, 45) rotate(15)">
             <path d="M-10 -10L10 10M10 -10L-10 10" stroke="#FF007A" strokeWidth="4" strokeLinecap="round" />
             <circle r="4" fill="#FF007A" />
             <path d="M0 0C5 10 15 15 20 10" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        </motion.g>
      </svg>
      
      {/* Digital Emotion Tags */}
      <AnimatePresence>
        {mood === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -right-6 top-2 font-mono text-[9px] bg-pink-500/10 border border-pink-500/30 text-pink-500 px-2 py-1 rounded-full backdrop-blur-sm shadow-[0_0_10px_rgba(255,100,200,0.2)]"
          >
            SYS.SYNC ♡
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
