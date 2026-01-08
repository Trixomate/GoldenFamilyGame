
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface GameHeaderProps {
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  showTitle: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ currentIndex, totalItems, onPrev, onNext, showTitle }) => {
  return (
    <div className="h-[15%] shrink-0 flex items-center justify-between px-[5%] bg-black/40 backdrop-blur-2xl border-b border-white/10 z-30 relative">
      <div className="w-[20%] flex justify-start">
        <button 
          onClick={onPrev}
          disabled={currentIndex === -1}
          className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === -1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
        >
          <ChevronLeftIcon className="w-[3vh] h-[3vh] transition-transform group-hover:-translate-x-1" />
          <span className="font-bold tracking-widest text-[1.4vh] uppercase">Previous</span>
        </button>
      </div>

      <div className="flex flex-col items-center">
        {showTitle && (
          <div className="flex items-center justify-center space-x-[1vw]">
            <h2 className="text-[5vh] px-[2vw] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 drop-shadow-[0_0.5vh_1.5vh_rgba(59,130,246,0.3)]">
              <span className="text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]">GOLDEN</span> FAMILY
            </h2>
          </div>
        )}
      </div>

      <div className="w-[20%] flex justify-end">
        <button 
          onClick={onNext}
          disabled={currentIndex === totalItems - 1}
          className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === totalItems - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5 bg-blue-500/5'}`}
        >
          <span className="font-bold tracking-widest text-[1.4vh] uppercase">Next</span>
          <ChevronRightIcon className="w-[3vh] h-[3vh] transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
