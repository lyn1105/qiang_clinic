import { RoomId } from './types';
import { Waves, Scissors, DoorOpen, Ghost, Radio } from 'lucide-react';

export const ROOMS = [
  {
    id: 'basin' as RoomId,
    name: '强子的冷水盆',
    enName: 'Cold Water Basin',
    icon: Waves,
    description: '生理调节 / SOS 呼吸法',
    color: 'text-blue-400',
  },
  {
    id: 'shredder' as RoomId,
    name: '强子的碎纸机',
    enName: 'The Shredder',
    icon: Scissors,
    description: '认知重构 / CBT 思维粉碎',
    color: 'text-orange-400',
  },
  {
    id: 'exit' as RoomId,
    name: '强子的出门右转',
    enName: 'Turn Right',
    icon: DoorOpen,
    description: '行动干预 / 森田疗法',
    color: 'text-green-400',
  },
  {
    id: 'monster' as RoomId,
    name: '怪兽命名馆',
    enName: 'Monster Hall',
    icon: Ghost,
    description: '叙事疗法 / 情绪外化',
    color: 'text-purple-400',
  },
  {
    id: 'radio' as RoomId,
    name: '深夜电台',
    enName: 'Midnight Radio',
    icon: Radio,
    description: '催眠疗法 / 声音与共振',
    color: 'text-pink-400',
  },
];
