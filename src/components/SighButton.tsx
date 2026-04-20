import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Loader2, Info } from 'lucide-react';
import { analyzeSigh } from '../services/gemini';
import { TriageResult } from '../types';

interface SighButtonProps {
  onComplete: (result: TriageResult) => void;
}

export const SighButton: React.FC<SighButtonProps> = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('无法访问麦克风，老板。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const result = await analyzeSigh(base64Audio, 'audio/webm');
        onComplete(result);
        setIsProcessing(false);
      };
    } catch (err) {
      console.error(err);
      setError('强子没听清，再叹一个？');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-cyber-secondary rounded-full blur-xl"
            />
          )}
        </AnimatePresence>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 scale-110 shadow-lg' 
              : 'bg-cyber-secondary hover:bg-cyber-secondary/80'
          } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin text-white" size={32} />
          ) : isRecording ? (
            <Square className="text-white" size={32} fill="currentColor" />
          ) : (
            <Mic className="text-white" size={32} />
          )}
        </button>
      </div>

      <div className="text-center space-y-1">
        <div className="text-sm font-bold">
          {isProcessing ? '分析叹息中...' : isRecording ? '松开即分析' : '对着强子叹气'}
        </div>
        <div className="text-[10px] text-cyber-muted uppercase tracking-tight flex items-center gap-1 justify-center">
          <Info size={10} />
          <span>不识别语义 / 只解析声纹情绪</span>
        </div>
      </div>

      {error && (
        <div className="text-[10px] text-red-500 font-medium">{error}</div>
      )}
    </div>
  );
};
