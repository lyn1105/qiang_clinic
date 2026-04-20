/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { CyberTriage } from './components/CyberTriage';
import { RoomSelector } from './components/RoomSelector';
import { Room1ColdWater } from './components/TreatmentRooms/Room1ColdWater';
import { Room2Shredder } from './components/TreatmentRooms/Room2Shredder';
import { Room3TurnRight } from './components/TreatmentRooms/Room3TurnRight';
import { Room4Monster } from './components/TreatmentRooms/Room4Monster';
import { Room5Radio } from './components/TreatmentRooms/Room5Radio';
import { TriageResult, RoomId } from './types';

export default function App() {
  const [activeRoom, setActiveRoom] = useState<RoomId>('triage');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handleTriageComplete = (result: TriageResult) => {
    setTriageResult(result);
    // Show the selector first to give feedback
  };

  const navigateTo = (roomId: RoomId) => {
    if (roomId === 'triage') {
      setTriageResult(null);
    }
    setActiveRoom(roomId);
  };

  return (
    <Layout activeRoom={activeRoom} onNavigate={navigateTo}>
      <div className="fixed bottom-2 right-2 text-[10px] text-cyan-500/30 font-mono pointer-events-none selection:bg-transparent">
        VER: 0.5.1-NEW
      </div>
      {activeRoom === 'triage' && !triageResult && (
        <CyberTriage onComplete={handleTriageComplete} />
      )}

      {activeRoom === 'triage' && triageResult && (
        <RoomSelector 
          triageResult={triageResult} 
          onRoomSelect={(roomId) => setActiveRoom(roomId)} 
        />
      )}

      {activeRoom === 'basin' && <Room1ColdWater />}
      {activeRoom === 'shredder' && <Room2Shredder />}
      {activeRoom === 'exit' && <Room3TurnRight />}
      {activeRoom === 'monster' && <Room4Monster />}
      {activeRoom === 'radio' && <Room5Radio />}
    </Layout>
  );
}
