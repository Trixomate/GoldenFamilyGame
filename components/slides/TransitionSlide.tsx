
import React from 'react';
import { Transition } from '../../types';

export const TransitionSlide: React.FC<{ item: Transition }> = ({ item }) => (
  <div className="absolute inset-0 flex flex-col items-center w-full h-full relative z-20">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_80%)] -z-10" />
    
    <div className="mt-[10vh] flex-none">
        <div className="text-[2vh] font-mono text-blue-300 tracking-[0.5em] uppercase border px-[2vw] py-[0.5vh] rounded-full border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
          Prochain Thème
        </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center w-full space-y-[4vh] pb-[10vh]">
        <h1 className="text-[12vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-300 drop-shadow-[0_0.5vh_2vh_rgba(0,0,0,0.8)] uppercase text-center max-w-[90%] leading-[1.1]">
          {item.title}
        </h1>

        {item.subtitle && (
          <p className="text-[5vh] text-blue-200/90 font-light tracking-wide text-center max-w-[80%]">
            {item.subtitle}
          </p>
        )}
    </div>
  </div>
);
