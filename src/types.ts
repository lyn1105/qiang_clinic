export type MoodState = {
  cognition: number; // 反刍频率 (Rumination) - 0 to 100
  emotion: number;   // 激活/压抑 (Valence/Arousal) - -50 to 50
  physiology: number; // 紧绷/瘫软 (Tension) - 0 to 100
};

export type TriageResult = {
  analysis: string;
  state: MoodState;
  recommendedRoom: string;
};

export type RoomId = 'triage' | 'basin' | 'shredder' | 'exit' | 'monster' | 'radio';

export type Monster = {
  name: string;
  trait: string;
  power: string;
  description: string;
};
