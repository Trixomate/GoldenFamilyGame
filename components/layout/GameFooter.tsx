
import React from 'react';
import { TeamControl } from '../game/TeamControl';
import { TeamState } from '../../types';

interface GameFooterProps {
  teams: {
    A: TeamState & { setScore: React.Dispatch<React.SetStateAction<number>>, toggleStrike: (i: number) => void };
    B: TeamState & { setScore: React.Dispatch<React.SetStateAction<number>>, toggleStrike: (i: number) => void };
  };
}

export const GameFooter: React.FC<GameFooterProps> = ({ teams }) => {
  return (
    <div className="h-[15%] shrink-0 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center justify-between z-30 relative overflow-hidden">
      <TeamControl 
        name="Family A" 
        score={teams.A.score} 
        setScore={teams.A.setScore} 
        strikes={teams.A.strikes} 
        toggleStrike={teams.A.toggleStrike} 
      />
      <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <TeamControl 
        name="Family B" 
        score={teams.B.score} 
        setScore={teams.B.setScore} 
        strikes={teams.B.strikes} 
        toggleStrike={teams.B.toggleStrike} 
        reverse={true} 
      />
    </div>
  );
};
