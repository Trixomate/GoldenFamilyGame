
import React from 'react';
import { Question } from '../../types';
import { AnswerCard } from '../AnswerCard';

interface QuestionBoardProps {
  item: Question;
  revealed: boolean[];
  onReveal: (index: number) => void;
  boardNumber: number;
  totalBoards: number;
}

export const QuestionBoard6: React.FC<QuestionBoardProps> = ({ item, revealed, onReveal, boardNumber, totalBoards }) => (
  <div className="absolute inset-0 flex w-full">
    {/* Left: Question Display */}
    <div className="w-1/2 flex flex-col items-center justify-start border-r border-white/5 relative group px-[4vw] py-[4vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />
      
      <div className="mb-[2vh] px-[2vw] py-[1vh] bg-blue-500/10 border border-blue-500/20 rounded-full z-10 shrink-0 backdrop-blur-sm">
        <span className="text-[1.5vh] font-mono font-black text-blue-300 tracking-[0.3em] uppercase">
          Board {boardNumber} / {totalBoards}
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center w-full z-10">
        <h1 className="text-[4.8vh] font-black leading-[1.1] text-center drop-shadow-[0_1vh_1vh_rgba(0,0,0,0.5)] uppercase break-words w-full">
            {item.question}
        </h1>
      </div>
    </div>

    {/* Right: Answer Cards (6 Smaller Cards) */}
    <div className="w-1/2 px-[5%] py-[3vh] flex flex-col justify-center space-y-[1.2vh] bg-black/10 overflow-hidden">
      {item.answers?.map((answer, idx) => (
        <AnswerCard 
          key={idx} 
          index={idx} 
          answer={answer} 
          revealed={revealed[idx]} 
          onReveal={() => onReveal(idx)}
          heightClass="h-[8.5vh]" // Reduced height to fit 6 items comfortably
        />
      ))}
    </div>
  </div>
);
