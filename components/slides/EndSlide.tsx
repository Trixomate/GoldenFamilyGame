
import React from 'react';
import { TrophyIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { End, TeamState } from '../../types';

interface EndSlideProps {
  item: End;
  teams: { A: TeamState; B: TeamState };
  onBack: () => void;
}

export const EndSlide: React.FC<EndSlideProps> = ({ item, teams, onBack }) => {
  const winner = teams.A.score > teams.B.score ? 'Famille A' : (teams.B.score > teams.A.score ? 'Famille B' : 'Tie');
  const isTie = teams.A.score === teams.B.score;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20 w-full h-full pb-[5vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15)_0%,transparent_70%)] -z-10" />
      
      <h1 className="text-[8vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 drop-shadow-[0_1vh_2vh_rgba(0,0,0,0.8)] uppercase text-center mb-[4vh] opacity-80">
        {item.title}
      </h1>

      <div className="flex flex-col items-center animate-in zoom-in duration-700">
          <div className="flex items-center space-x-[2vw] mb-[4vh]">
              <TrophyIcon className="w-[6vh] h-[6vh] text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]" />
              <span className="text-[3vh] font-mono text-yellow-200 tracking-[0.5em] uppercase">Vainqueur</span>
              <TrophyIcon className="w-[6vh] h-[6vh] text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]" />
          </div>
          
          {isTie ? (
              <div className="flex flex-col items-center">
                   <div className="text-[12vh] font-black italic text-white drop-shadow-[0_0_3vh_rgba(255,255,255,0.4)]">
                      ÉGALITÉ
                  </div>
                  <div className="mt-[2vh] text-[4vh] text-zinc-400 font-mono">{teams.A.score} - {teams.B.score}</div>
              </div>
          ) : (
              <div className="flex flex-col items-center group">
                  <div className={`
                      text-[14vh] font-black italic tracking-tighter uppercase leading-none 
                      drop-shadow-[0_1vh_4vh_rgba(0,0,0,0.8)] 
                      text-transparent bg-clip-text bg-gradient-to-br 
                      ${winner === 'Famille A' ? "from-fuchsia-300 via-pink-500 to-rose-600" : "from-cyan-300 via-sky-400 to-blue-600"}
                      scale-110 group-hover:scale-115 transition-transform duration-500
                      pb-[1vh] pr-[2vw]
                  `}>
                      {winner}
                  </div>
                  
                  <div className="mt-[4vh] px-[6vw] py-[2vh] bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-[2vh] border border-white/20 backdrop-blur-xl shadow-[0_1vh_3vh_rgba(0,0,0,0.4)] flex items-baseline space-x-[2vw]">
                      <span className="text-[8vh] font-black text-white drop-shadow-lg leading-none">
                          {winner === 'Famille A' ? teams.A.score : teams.B.score}
                      </span>
                      <span className="text-[3vh] font-bold text-zinc-400 uppercase tracking-widest">Points</span>
                  </div>
              </div>
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
