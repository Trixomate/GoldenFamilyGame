
import React from 'react';
import { ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface IntroSlideProps {
  onStart: () => void;
  onBack: () => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ onStart, onBack }) => (
  <div className="absolute inset-0 flex flex-col items-center w-full h-full z-20 py-[10vh]">
    
    {/* Back to Setup Button */}
    <button 
      onClick={onBack}
      className="absolute top-[4vh] left-[4vh] flex items-center space-x-[1vh] text-white/30 hover:text-white/80 transition-colors group"
    >
      <ArrowLeftIcon className="w-[3vh] h-[3vh] group-hover:-translate-x-1 transition-transform" />
      <span className="text-[1.8vh] font-bold tracking-widest uppercase">Setup</span>
    </button>

    {/* 1. Title Section */}
    <div className="flex-1 flex items-end justify-center pb-[5vh]">
       <h1 className="text-[14vh] px-[2vw] font-black tracking-tighter italic leading-none drop-shadow-[0_2vh_4vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 scale-110">
        <span className="text-yellow-400 drop-shadow-[0_0_3vh_rgba(250,204,21,0.6)]">GOLDEN</span> FAMILY
      </h1>
    </div>

    {/* 2. Description */}
    <div className="flex-none py-[5vh] px-[10%]">
      <p className="text-[3.5vh] text-zinc-300 font-light text-center leading-relaxed tracking-wide drop-shadow-lg">
        Welcome to the ultimate survey challenge. <br/>
        Does your family know what the <span className="text-white font-bold italic">world</span> thinks?
      </p>
    </div>

    {/* 3. Button */}
    <div className="flex-1 flex items-start justify-center pt-[5vh]">
      <button onClick={onStart} className="group relative inline-flex items-center justify-center px-[8vw] py-[4vh] font-black text-[3.5vh] tracking-[0.25em] uppercase bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2.5vh] shadow-[0_1vh_4vh_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden ring-1 ring-white/20">
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 drop-shadow-md">Start</span>
        <ChevronRightIcon className="relative z-10 w-[4vh] h-[4vh] ml-[1.5vw] transition-transform group-hover:translate-x-1 stroke-[3]" />
      </button>
    </div>
  </div>
);
