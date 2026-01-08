
import React from 'react';
import { TrophyIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { TeamState } from '../../types';

interface EndSlideProps {
  teams: { A: TeamState; B: TeamState };
  onBack: () => void;
}

export const EndSlide: React.FC<EndSlideProps> = ({ teams, onBack }) => {
  const scoreA = teams.A.score;
  const scoreB = teams.B.score;
  
  let winnerName = 'Tie';
  let winnerScore = scoreA;
  
  if (scoreA > scoreB) {
      winnerName = 'Famille A';
      winnerScore = scoreA;
  } else if (scoreB > scoreA) {
      winnerName = 'Famille B';
      winnerScore = scoreB;
  }

  const isTie = scoreA === scoreB;

  return (
    <div className="absolute inset-0 flex flex-col items-center py-[8vh] relative z-20 w-full h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15)_0%,transparent_70%)] -z-10" />
      
      {/* 1. Title Top */}
      <div className="flex-none mb-[6vh]">
        <h1 className="text-[6vh] font-black tracking-tighter italic leading-none drop-shadow-[0_1vh_2vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 text-center">
            une FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_2vh_rgba(250,204,21,0.6)]">OR</span>
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-[6vh]">
          
          {/* 2. "Vainqueur" Text */}
          <div className="flex flex-col items-center">
             <span className="text-[4vh] font-mono text-yellow-200 tracking-[0.5em] uppercase opacity-90 drop-shadow-[0_0_1vh_rgba(250,204,21,0.4)]">
                 Vainqueur
             </span>
          </div>

          {isTie ? (
               <div className="flex flex-col items-center">
                   <div className="text-[10vh] font-black italic text-white drop-shadow-[0_0_3vh_rgba(255,255,255,0.4)]">
                      ÉGALITÉ
                  </div>
                  <div className="mt-[2vh] text-[4vh] text-zinc-400 font-mono">{scoreA} - {scoreB}</div>
              </div>
          ) : (
              <>
                {/* 3. Winning Family between Trophies */}
                <div className="flex items-center justify-center w-full space-x-[4vw]">
                    <TrophyIcon className="w-[8vh] h-[8vh] text-yellow-400 drop-shadow-[0_0_2vh_rgba(250,204,21,0.6)] animate-pulse" />
                    
                    <div className={`
                        text-[12vh] font-black italic tracking-tighter uppercase leading-none 
                        drop-shadow-[0_1vh_4vh_rgba(0,0,0,0.8)] 
                        text-transparent bg-clip-text bg-gradient-to-br
                        pb-[1vh] px-[0.2em]
                        ${winnerName === 'Famille A' ? "from-fuchsia-300 via-pink-500 to-rose-600" : "from-cyan-300 via-sky-400 to-blue-600"}
                    `}>
                        {winnerName}
                    </div>

                    <TrophyIcon className="w-[8vh] h-[8vh] text-yellow-400 drop-shadow-[0_0_2vh_rgba(250,204,21,0.6)] animate-pulse" />
                </div>

                {/* 4. Score styled like Gold Answer Card */}
                {/* Score Number on LEFT (Dark Box), "POINTS" on RIGHT */}
                <div className="relative group perspective-1000 mt-[2vh]">
                     <div className="relative flex items-center w-full h-[16vh] rounded-[1.5vh] border-[0.5vh] border-yellow-300 shadow-[0_0_5vh_rgba(251,191,36,0.4)] bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 min-w-[40vw] transform hover:scale-105 transition-transform duration-500 overflow-hidden">
                        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }} />
                        
                        {/* Dark Box for Number (Left) - Increased width and padding for 3 digits */}
                        <div className="relative z-10 h-full min-w-[24vh] px-[3vh] flex items-center justify-center bg-black/15 border-r-[0.3vh] border-white/30">
                          <span className="text-[8vh] font-black text-white drop-shadow-[0_0.5vh_1vh_rgba(0,0,0,0.6)]">
                            {winnerScore}
                          </span>
                        </div>

                        {/* Text Label (Right) */}
                        <div className="flex-1 flex items-center justify-center">
                            <span className="relative z-10 text-[5vh] font-black text-amber-950 uppercase tracking-tighter drop-shadow-sm">
                                POINTS
                            </span>
                        </div>
                     </div>
                </div>
              </>
          )}
      </div>
      
      <button 
        onClick={onBack}
        className="absolute bottom-[5vh] left-[5vh] p-[2vh] text-white/10 hover:text-white/40 transition-colors rounded-full hover:bg-white/5"
      >
          <ChevronLeftIcon className="w-[4vh] h-[4vh]" />
      </button>
    </div>
  );
};
