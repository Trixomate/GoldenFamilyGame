
import React from 'react';
import { Answer } from '../../types';

interface AnswerCardProps {
  index: number;
  answer: Answer;
  revealed: boolean;
  onReveal: () => void;
  height: string; // Percentage string (e.g. "20%")
}

interface CardStyle {
  gradient: string;
  border: string;
  shadow: string;
  numText: string;
  revealedGradient: string;
  revealedBorder: string;
  textColor: string;
}

/**
 * Configuration dictionary for card styles based on rank (index).
 */
const CARD_STYLES: { [key: number]: CardStyle; default: CardStyle } = {
  0: { // Rank 1 (Gold/Amber)
    gradient: 'from-yellow-600 via-amber-600 to-amber-800',
    border: 'border-yellow-400/70',
    shadow: 'hover:shadow-[0_0_4vh_rgba(251,191,36,0.35)]',
    numText: 'text-white/95',
    revealedGradient: 'from-yellow-400 via-yellow-500 to-amber-600',
    revealedBorder: 'border-yellow-300',
    textColor: 'text-amber-950'
  },
  1: { // Rank 2 (Slate/Silver)
    gradient: 'from-slate-400 via-slate-500 to-slate-700',
    border: 'border-slate-100/70',
    shadow: 'hover:shadow-[0_0_4vh_rgba(226,232,240,0.35)]',
    numText: 'text-white/95',
    revealedGradient: 'from-white via-slate-200 to-slate-400',
    revealedBorder: 'border-white',
    textColor: 'text-slate-900'
  },
  2: { // Rank 3 (Bronze/Orange)
    gradient: 'from-orange-600 via-orange-700 to-orange-900',
    border: 'border-orange-400/70',
    shadow: 'hover:shadow-[0_0_4vh_rgba(234,88,12,0.35)]',
    numText: 'text-white/95',
    revealedGradient: 'from-orange-400 via-orange-500 to-orange-700',
    revealedBorder: 'border-orange-300',
    textColor: 'text-orange-950'
  },
  default: { // Ranks 4+ (Neutral Dark)
    gradient: 'from-neutral-700 via-neutral-800 to-neutral-950',
    border: 'border-neutral-600/50',
    shadow: 'hover:shadow-[0_0_3vh_rgba(163,163,163,0.2)]',
    numText: 'text-neutral-200',
    revealedGradient: 'from-neutral-300 via-neutral-400 to-neutral-500',
    revealedBorder: 'border-neutral-400',
    textColor: 'text-neutral-900'
  }
};

/**
 * Renders a single answer card.
 * Uses Container Queries (cqh) for font sizing to perfectly adapt to the card's calculated height.
 */
export const AnswerCard: React.FC<AnswerCardProps> = ({ index, answer, revealed, onReveal, height }) => {
  const style = CARD_STYLES[index] || CARD_STYLES.default;

  return (
    <div 
      className="relative perspective-1000 group shrink-0 w-full" 
      style={{ height, containerType: 'size' }}
    >
      {/* Front of Card (Hidden Answer) */}
      <button 
        onClick={onReveal} 
        className={`absolute inset-0 w-full h-full flex items-center justify-between px-[3vw] rounded-[1.5vh] border-[0.3vh] transition-all duration-700 transform-gpu cursor-pointer shadow-xl shadow-black/60 bg-gradient-to-b ${style.gradient} ${style.border} ${style.shadow} ${revealed ? 'rotate-x-180 opacity-0 pointer-events-none scale-90' : 'hover:-translate-y-1 active:scale-95'}`}
      >
        <div className="flex items-center space-x-[2vw]">
          <span 
            className={`font-black italic transition-all drop-shadow-md ${style.numText} group-hover:text-white`}
            style={{ fontSize: '42cqh' }}
          >
            {index + 1}
          </span>
          <div className="w-[4vw] h-[0.5vh] bg-white/30 rounded-full group-hover:bg-white/50 transition-colors" />
        </div>
        <div className="aspect-square h-[60%] rounded-full border-[0.3vh] border-white/50 flex items-center justify-center bg-white/15 shadow-[inset_0_0_1vh_rgba(255,255,255,0.1)]">
          <div className="w-[30%] h-[30%] rounded-full bg-white shadow-[0_0_1.5vh_rgba(255,255,255,0.9)] animate-pulse" />
        </div>
      </button>

      {/* Back of Card (Revealed Answer) */}
      <div className={`absolute inset-0 w-full h-full flex items-center justify-between bg-gradient-to-r ${style.revealedGradient} rounded-[1.5vh] border-[0.5vh] ${style.revealedBorder} shadow-2xl transition-all duration-700 transform-gpu backface-hidden overflow-hidden ${revealed ? 'rotate-x-0 opacity-100 scale-100' : 'rotate-x-[-110deg] opacity-0 scale-75'}`}>
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }} />
        <span 
          className={`relative z-10 pl-[3vw] font-black ${style.textColor} uppercase tracking-tighter drop-shadow-sm truncate pr-2 flex-1`}
          style={{ fontSize: '32cqh', lineHeight: '1.1' }}
        >
          {answer.text}
        </span>
        <div className="relative z-10 h-full aspect-[1.3/1] flex items-center justify-center bg-black/15 border-l-[0.3vh] border-white/30 shrink-0">
          <span 
            className="font-black text-white drop-shadow-[0_0.5vh_1vh_rgba(0,0,0,0.6)]"
            style={{ fontSize: '42cqh' }}
          >
            {answer.percentage}
          </span>
        </div>
      </div>
    </div>
  );
};
