
import React from 'react';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TeamControlProps {
  name: string;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  strikes: boolean[];
  toggleStrike: (idx: number) => void;
  reverse?: boolean;
}

const StrikesDisplay: React.FC<{ strikes: boolean[]; toggleStrike: (i: number) => void }> = ({ strikes, toggleStrike }) => (
  <div className="flex space-x-[0.5vw]">
    {strikes.map((active, i) => (
      <button 
        key={i} 
        onClick={() => toggleStrike(i)} 
        className={`w-[5vh] h-[5vh] rounded-full border-[0.3vh] transition-all duration-300 flex items-center justify-center shadow-xl ${active ? 'bg-red-600/95 border-red-400 shadow-red-900/50 scale-105 ring-[0.5vh] ring-red-500/20' : 'bg-zinc-800/60 border-zinc-700/40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
      >
        <XMarkIcon className={`w-[3vh] h-[3vh] font-black ${active ? 'text-white' : 'text-zinc-700'}`} strokeWidth={4} />
      </button>
    ))}
  </div>
);

const ScoreControls: React.FC<{ score: number; setScore: React.Dispatch<React.SetStateAction<number>> }> = ({ score, setScore }) => (
  <div className="flex items-center space-x-[1vw] bg-zinc-900/90 rounded-[1.5vh] border border-white/10 p-[0.6vh] shadow-2xl">
    <button 
      onClick={() => setScore(s => Math.max(0, s - 1))} 
      className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90"
    >
      <MinusIcon className="w-[2.5vh] h-[2.5vh]" />
    </button>
    <span className="text-[5vh] font-black text-white w-[8vh] text-center tracking-tighter drop-shadow-[0_0_2vh_rgba(255,255,255,0.3)] leading-none">
      {score}
    </span>
    <button 
      onClick={() => setScore(s => s + 1)} 
      className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90"
    >
      <PlusIcon className="w-[2.5vh] h-[2.5vh]" />
    </button>
  </div>
);

const TeamName: React.FC<{ name: string; reverse: boolean }> = ({ name, reverse }) => {
  // Theme: Bright Pink/Fuchsia (Team A) vs Cyan/Blue (Team B)
  const gradientClass = reverse 
    ? "from-cyan-300 via-sky-400 to-blue-500 drop-shadow-[0_0_1.5vh_rgba(6,182,212,0.6)]"
    : "from-fuchsia-300 via-pink-500 to-rose-500 drop-shadow-[0_0_1.5vh_rgba(236,72,153,0.6)]";
    
  return (
    <span className={`text-[3vh] font-black text-transparent bg-clip-text bg-gradient-to-r ${gradientClass} uppercase tracking-[0.2em] px-[1vw] whitespace-nowrap`}>
      {name}
    </span>
  );
};

export const TeamControl: React.FC<TeamControlProps> = ({ name, score, setScore, strikes, toggleStrike, reverse = false }) => {
  return (
    <div className="flex-1 flex items-center h-full px-[2vw]">
      {reverse ? (
        // Right Side (Team B): Inner(Strikes) | Center(Score) | Outer(Name)
        <>
          <div className="flex-1 flex justify-start items-center"><StrikesDisplay strikes={strikes} toggleStrike={toggleStrike} /></div>
          <div className="flex-none mx-[1vw]"><ScoreControls score={score} setScore={setScore} /></div>
          <div className="flex-1 flex justify-end items-center"><TeamName name={name} reverse={reverse} /></div>
        </>
      ) : (
        // Left Side (Team A): Outer(Name) | Center(Score) | Inner(Strikes)
        <>
          <div className="flex-1 flex justify-start items-center"><TeamName name={name} reverse={reverse} /></div>
          <div className="flex-none mx-[1vw]"><ScoreControls score={score} setScore={setScore} /></div>
          <div className="flex-1 flex justify-end items-center"><StrikesDisplay strikes={strikes} toggleStrike={toggleStrike} /></div>
        </>
      )}
    </div>
  );
};
