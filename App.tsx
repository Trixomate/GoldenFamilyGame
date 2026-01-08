
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, ExclamationTriangleIcon, PlayIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Answer {
  text: string;
  percentage: number;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 represents the Intro/Welcome slide
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Score & Strike State
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [strikesA, setStrikesA] = useState([false, false, false]);
  const [strikesB, setStrikesB] = useState([false, false, false]);

  // Load the questions from the external JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./questions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Could not load the survey data. Please ensure questions.json is available.");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null;

  const resetStrikes = () => {
    setStrikesA([false, false, false]);
    setStrikesB([false, false, false]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setRevealed([false, false, false]);
        resetStrikes();
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex >= 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setRevealed([false, false, false]);
        resetStrikes();
        setIsTransitioning(false);
      }, 300);
    }
  };

  const toggleReveal = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  const toggleStrikeA = (idx: number) => {
    const newStrikes = [...strikesA];
    newStrikes[idx] = !newStrikes[idx];
    setStrikesA(newStrikes);
  };

  const toggleStrikeB = (idx: number) => {
    const newStrikes = [...strikesB];
    newStrikes[idx] = !newStrikes[idx];
    setStrikesB(newStrikes);
  };

  const getButtonStyles = (idx: number) => {
    switch (idx) {
      case 0: // Gold Theme
        return {
          gradient: 'from-amber-700 via-amber-800 to-[#3d2500]',
          border: 'border-yellow-400/70',
          shadow: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-yellow-400 via-yellow-500 to-amber-600',
          revealedBorder: 'border-yellow-300',
          textColor: 'text-amber-950'
        };
      case 1: // Silver Theme
        return {
          gradient: 'from-slate-600 via-slate-700 to-[#2c3e50]',
          border: 'border-slate-100/70',
          shadow: 'hover:shadow-[0_0_40px_rgba(226,232,240,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-white via-slate-200 to-slate-400',
          revealedBorder: 'border-white',
          textColor: 'text-slate-900'
        };
      case 2: // Bronze Theme
        return {
          gradient: 'from-[#8b4513] via-[#632a0d] to-[#3d1a08]',
          border: 'border-orange-400/70',
          shadow: 'hover:shadow-[0_0_40px_rgba(234,88,12,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-orange-400 via-orange-500 to-orange-700',
          revealedBorder: 'border-orange-300',
          textColor: 'text-orange-950'
        };
      default:
        return {
          gradient: 'from-blue-800 via-blue-900 to-black',
          border: 'border-blue-400/70',
          shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
          numText: 'text-white/95',
          revealedGradient: 'from-blue-400 via-blue-500 to-blue-600',
          revealedBorder: 'border-blue-300',
          textColor: 'text-blue-950'
        };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (currentIndex >= 0) {
        if (e.key === '1') toggleReveal(0);
        if (e.key === '2') toggleReveal(1);
        if (e.key === '3') toggleReveal(2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Broadcast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Technical Difficulty</h2>
        <p className="text-zinc-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      <div className="w-full max-w-6xl aspect-video bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-3xl shadow-[0_0_80px_rgba(30,27,75,0.4)] border border-white/10 flex flex-col relative overflow-hidden ring-1 ring-white/5">
        
        {/* Navigation Header */}
        <div className="h-20 flex items-center justify-between px-10 bg-black/30 backdrop-blur-xl border-b border-white/5 z-20">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === -1}
            className={`group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${currentIndex === -1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
          >
            <ChevronLeftIcon className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-widest text-sm uppercase">Previous</span>
          </button>

          <div className="flex flex-col items-center text-center">
             <div className="flex items-center justify-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-black text-blue-400 tracking-[0.4em] uppercase">Survey Says</span>
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
             </div>
             {currentIndex >= 0 && (
               <div className="mt-1 px-4 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <span className="text-[10px] font-mono font-bold text-blue-300/80 uppercase">Board {currentIndex + 1} / {questions.length}</span>
               </div>
             )}
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${currentIndex === questions.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
          >
            <span className="font-bold tracking-widest text-sm uppercase">{currentIndex === -1 ? 'Start Game' : 'Next'}</span>
            <ChevronRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Slide Content Container */}
        <div className={`flex-1 flex transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          
          {currentIndex === -1 ? (
            /* --- INTRO SLIDE --- */
            <div className="w-full flex flex-col items-center justify-center p-20 text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse"></div>
              
              <div className="z-10 animate-in fade-in zoom-in duration-1000">
                <div className="inline-flex items-center space-x-3 mb-6 px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                  <PlayIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black text-blue-300 tracking-[0.3em] uppercase">Now Airing</span>
                </div>
                
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-4 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400">
                  Family <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Freud</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-12 tracking-wide">
                  Welcome to the ultimate survey challenge. 
                  Does the family know what the <span className="text-white font-bold italic">world</span> thinks?
                </p>

                <button 
                  onClick={handleNext}
                  className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-xl tracking-[0.2em] uppercase bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-2xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10">Enter Studio</span>
                  <ChevronRightIcon className="relative z-10 w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
                </button>
              </div>

              {/* Decorative elements for intro */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-[100px] rounded-full"></div>
            </div>
          ) : (
            /* --- GAME SLIDE --- */
            <div className="w-full h-full flex flex-col relative">
              <div className="flex-1 flex w-full">
                {/* Left Panel: Question Display */}
                <div className="w-1/2 p-16 flex items-center justify-center border-r border-white/5 relative group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50"></div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                    {currentQuestion?.question}
                  </h1>
                </div>

                {/* Right Panel: Interactive Answer Slots */}
                <div className="w-1/2 p-16 flex flex-col justify-center space-y-6 bg-black/10 overflow-y-auto">
                  {currentQuestion?.answers.map((answer, idx) => {
                    const styles = getButtonStyles(idx);
                    return (
                      <div key={idx} className="relative h-24 perspective-1000 group shrink-0">
                        {/* Unrevealed Button */}
                        <button
                          onClick={() => toggleReveal(idx)}
                          className={`
                            absolute inset-0 w-full h-full flex items-center justify-between px-10
                            rounded-2xl border-2 transition-all duration-700 transform-gpu cursor-pointer shadow-2xl shadow-black/60
                            bg-gradient-to-b ${styles.gradient} ${styles.border} ${styles.shadow}
                            ${revealed[idx] 
                              ? 'rotate-x-180 opacity-0 pointer-events-none scale-90' 
                              : 'hover:-translate-y-1 active:scale-95'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-6">
                            <span className={`text-4xl font-black italic transition-all drop-shadow-md ${styles.numText} group-hover:text-white`}>
                              {idx + 1}
                            </span>
                            <div className="w-16 h-1.5 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
                          </div>
                          <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center bg-white/15 shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]">
                            <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse"></div>
                          </div>
                        </button>

                        {/* Revealed Answer Panel */}
                        <div className={`
                          absolute inset-0 w-full h-full flex items-center justify-between
                          bg-gradient-to-r ${styles.revealedGradient} rounded-2xl border-4 ${styles.revealedBorder} shadow-2xl
                          transition-all duration-700 transform-gpu backface-hidden overflow-hidden
                          ${revealed[idx] ? 'rotate-x-0 opacity-100 scale-100' : 'rotate-x-[-110deg] opacity-0 scale-75'}
                        `}>
                          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }}></div>
                          
                          <span className={`relative z-10 pl-10 text-2xl md:text-3xl font-black ${styles.textColor} uppercase tracking-tighter drop-shadow-sm`}>
                            {answer.text}
                          </span>
                          
                          <div className="relative z-10 h-full flex items-center px-8 bg-black/15 border-l-2 border-white/30">
                            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
                              {answer.percentage}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- SCORE BAR AT THE BOTTOM --- */}
              <div className="h-32 bg-black/60 border-t border-white/10 backdrop-blur-md px-12 flex items-center justify-between z-10">
                {/* Family A Controls: [Score] [Strikes] */}
                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-blue-400 uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Family A</span>
                    <div className="flex items-center space-x-4 bg-zinc-900/90 rounded-2xl border border-white/10 p-2 shadow-2xl">
                      <button onClick={() => setScoreA(s => Math.max(0, s - 1))} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90">
                        <MinusIcon className="w-6 h-6" />
                      </button>
                      <span className="text-5xl font-black text-white w-24 text-center tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        {scoreA}
                      </span>
                      <button onClick={() => setScoreA(s => s + 1)} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90">
                        <PlusIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Strikes Family A */}
                  <div className="flex space-x-3 self-end pb-2">
                    {strikesA.map((active, i) => (
                      <button
                        key={i}
                        onClick={() => toggleStrikeA(i)}
                        className={`w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-xl
                          ${active 
                            ? 'bg-red-600/95 border-red-400 shadow-red-900/50 scale-105 ring-4 ring-red-500/20' 
                            : 'bg-zinc-800/60 border-zinc-700/40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105'
                          }
                        `}
                      >
                        <XMarkIcon className={`w-10 h-10 font-black ${active ? 'text-white' : 'text-zinc-700'}`} strokeWidth={4} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-[2px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                {/* Family B Controls: [Strikes] [Score] (Mirrored) */}
                <div className="flex items-center gap-12">
                  {/* Strikes Family B - Placed on the inner side for symmetry */}
                  <div className="flex space-x-3 self-end pb-2">
                    {strikesB.map((active, i) => (
                      <button
                        key={i}
                        onClick={() => toggleStrikeB(i)}
                        className={`w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-xl
                          ${active 
                            ? 'bg-red-600/95 border-red-400 shadow-red-900/50 scale-105 ring-4 ring-red-500/20' 
                            : 'bg-zinc-800/60 border-zinc-700/40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105'
                          }
                        `}
                      >
                        <XMarkIcon className={`w-10 h-10 font-black ${active ? 'text-white' : 'text-zinc-700'}`} strokeWidth={4} />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-blue-400 uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Family B</span>
                    <div className="flex items-center space-x-4 bg-zinc-900/90 rounded-2xl border border-white/10 p-2 shadow-2xl">
                      <button onClick={() => setScoreB(s => Math.max(0, s - 1))} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90">
                        <MinusIcon className="w-6 h-6" />
                      </button>
                      <span className="text-5xl font-black text-white w-24 text-center tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        {scoreB}
                      </span>
                      <button onClick={() => setScoreB(s => s + 1)} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-90">
                        <PlusIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Ambient Visual Decorations */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-32 bg-blue-500/20 blur-sm rounded-r-full"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-32 bg-blue-500/20 blur-sm rounded-l-full"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center space-x-12 opacity-30">
        <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-white">ARROWS</kbd>
            <span className="text-[10px] font-bold tracking-widest uppercase">Navigate</span>
        </div>
        {currentIndex >= 0 && (
          <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-white">1-3</kbd>
              <span className="text-[10px] font-bold tracking-widest uppercase">Reveal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
