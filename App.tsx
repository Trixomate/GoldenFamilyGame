
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import yaml from 'js-yaml';

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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./questions.yaml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const yamlText = await response.text();
        const data = yaml.load(yamlText) as Question[];
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Could not load the survey data. Please ensure questions.yaml is available.");
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
      setRevealed([false, false, false]);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        resetStrikes();
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (currentIndex >= 0) {
      setIsTransitioning(true);
      setRevealed([false, false, false]);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        resetStrikes();
        setIsTransitioning(false);
      }, 500);
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
          shadow: 'hover:shadow-[0_0_4vh_rgba(251,191,36,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-yellow-400 via-yellow-500 to-amber-600',
          revealedBorder: 'border-yellow-300',
          textColor: 'text-amber-950'
        };
      case 1: // Silver Theme
        return {
          gradient: 'from-slate-600 via-slate-700 to-[#2c3e50]',
          border: 'border-slate-100/70',
          shadow: 'hover:shadow-[0_0_4vh_rgba(226,232,240,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-white via-slate-200 to-slate-400',
          revealedBorder: 'border-white',
          textColor: 'text-slate-900'
        };
      case 2: // Bronze Theme
        return {
          gradient: 'from-[#8b4513] via-[#632a0d] to-[#3d1a08]',
          border: 'border-orange-400/70',
          shadow: 'hover:shadow-[0_0_4vh_rgba(234,88,12,0.35)]',
          numText: 'text-white/95',
          revealedGradient: 'from-orange-400 via-orange-500 to-orange-700',
          revealedBorder: 'border-orange-300',
          textColor: 'text-orange-950'
        };
      default:
        return {
          gradient: 'from-blue-800 via-blue-900 to-black',
          border: 'border-blue-400/70',
          shadow: 'hover:shadow-[0_0_3vh_rgba(59,130,246,0.25)]',
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
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center overflow-hidden font-sans">
      <div 
        className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-[2vh] shadow-[0_0_10vh_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/5"
        style={{
          width: '95vw',
          height: 'calc(95vw * 9 / 16)',
          maxHeight: '95vh',
          maxWidth: 'calc(95vh * 16 / 9)',
        }}
      >
        
        {/* HEADER - Fixed Height 15% */}
        <div className="h-[15%] shrink-0 flex items-center justify-between px-[5%] bg-black/40 backdrop-blur-2xl border-b border-white/10 z-30 relative">
          <div className="w-[20%] flex justify-start">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === -1}
              className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === -1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
            >
              <ChevronLeftIcon className="w-[3vh] h-[3vh] transition-transform group-hover:-translate-x-1" />
              <span className="font-bold tracking-widest text-[1.4vh] uppercase">Précédent</span>
            </button>
          </div>

          <div className="flex flex-col items-center">
             {currentIndex >= 0 ? (
               <div className="flex items-center justify-center space-x-[1vw]">
                  <h2 className="text-[5vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 drop-shadow-[0_0.5vh_1.5vh_rgba(59,130,246,0.3)] uppercase">
                    FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]">OR</span>
                  </h2>
               </div>
             ) : (
               <div className="w-44 h-8"></div>
             )}
          </div>

          <div className="w-[20%] flex justify-end">
            <button 
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === questions.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5 bg-blue-500/5'}`}
            >
              <span className="font-bold tracking-widest text-[1.4vh] uppercase">{currentIndex === -1 ? 'Commencer' : 'Suivant'}</span>
              <ChevronRightIcon className="w-[3vh] h-[3vh] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* GAME AREA - Flex 1 (Takes remaining space) */}
        <div className="flex-1 relative overflow-hidden z-10">
          
          <div className={`w-full h-full relative transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            {currentIndex === -1 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-[5%] text-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse"></div>
                <div className="z-10 animate-in fade-in zoom-in duration-1000">
                  <h1 className="text-[12vh] font-black tracking-tighter italic leading-none mb-[2vh] drop-shadow-[0_2vh_2vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 uppercase">
                    FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_2vh_rgba(250,204,21,0.5)]">OR</span>
                  </h1>
                  <p className="text-[3vh] text-zinc-400 font-light max-w-[80%] mx-auto mb-[6vh] tracking-wide">
                    Bienvenue au défi ultime des sondages. <br/>
                    Votre famille sait-elle ce que le <span className="text-white font-bold italic">monde</span> pense ?
                  </p>
                  <button 
                    onClick={handleNext}
                    className="group relative inline-flex items-center justify-center px-[6vw] py-[3vh] font-black text-[3vh] tracking-[0.2em] uppercase bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2vh] shadow-2xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10">Commencer</span>
                    <ChevronRightIcon className="relative z-10 w-[3vh] h-[3vh] ml-[1vw] transition-transform group-hover:translate-x-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex w-full">
                {/* Left: Question */}
                <div className="w-1/2 p-[5%] flex flex-col items-center justify-center border-r border-white/5 relative group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50"></div>
                  <div className="mb-[3vh] px-[2vw] py-[1vh] bg-blue-500/10 border border-blue-500/20 rounded-full z-10 shrink-0">
                    <span className="text-[1.5vh] font-mono font-black text-blue-300 tracking-[0.3em] uppercase">
                      Board {currentIndex + 1} / {questions.length}
                    </span>
                  </div>
                  <h1 className="text-[4.8vh] font-black leading-[1.1] text-center drop-shadow-[0_1vh_1vh_rgba(0,0,0,0.5)] z-10 uppercase">
                    {currentQuestion?.question}
                  </h1>
                </div>

                {/* Right: Answers */}
                <div className="w-1/2 p-[5%] flex flex-col justify-center space-y-[2.5vh] bg-black/10 overflow-y-auto">
                  {currentQuestion?.answers.map((answer, idx) => {
                    const styles = getButtonStyles(idx);
                    return (
                      <div key={idx} className="relative h-[15vh] perspective-1000 group shrink-0">
                        <button
                          onClick={() => toggleReveal(idx)}
                          className={`absolute inset-0 w-full h-full flex items-center justify-between px-[3vw] rounded-[1.5vh] border-[0.3vh] transition-all duration-700 transform-gpu cursor-pointer shadow-xl shadow-black/60 bg-gradient-to-b ${styles.gradient} ${styles.border} ${styles.shadow} ${revealed[idx] ? 'rotate-x-180 opacity-0 pointer-events-none scale-90' : 'hover:-translate-y-1 active:scale-95'}`}
                        >
                          <div className="flex items-center space-x-[2vw]">
                            <span className={`text-[5vh] font-black italic transition-all drop-shadow-md ${styles.numText} group-hover:text-white`}>{idx + 1}</span>
                            <div className="w-[4vw] h-[0.5vh] bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
                          </div>
                          <div className="w-[6vh] h-[6vh] rounded-full border-[0.3vh] border-white/50 flex items-center justify-center bg-white/15 shadow-[inset_0_0_1vh_rgba(255,255,255,0.1)]">
                            <div className="w-[2vh] h-[2vh] rounded-full bg-white shadow-[0_0_1.5vh_rgba(255,255,255,0.9)] animate-pulse"></div>
                          </div>
                        </button>
                        <div className={`absolute inset-0 w-full h-full flex items-center justify-between bg-gradient-to-r ${styles.revealedGradient} rounded-[1.5vh] border-[0.5vh] ${styles.revealedBorder} shadow-2xl transition-all duration-700 transform-gpu backface-hidden overflow-hidden ${revealed[idx] ? 'rotate-x-0 opacity-100 scale-100' : 'rotate-x-[-110deg] opacity-0 scale-75'}`}>
                          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }}></div>
                          <span className={`relative z-10 pl-[3vw] text-[4vh] font-black ${styles.textColor} uppercase tracking-tighter drop-shadow-sm`}>{answer.text}</span>
                          <div className="relative z-10 h-full flex items-center px-[2vw] bg-black/15 border-l-[0.3vh] border-white/30">
                            <span className="text-[6vh] font-black text-white drop-shadow-[0_0.5vh_1vh_rgba(0,0,0,0.6)]">{answer.percentage}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER - Fixed Height 15% - Always present structurally if active */}
        {currentIndex >= 0 && (
            <div className="h-[15%] shrink-0 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center justify-between z-30 relative overflow-hidden">
              
              {/* Family A Section - Takes 1/2 of space */}
              <div className="flex-1 flex items-center justify-center space-x-[2vw] px-[2%] h-full">
                <div className="flex flex-col items-center justify-center h-full py-[1vh]">
                  <span className="text-[2vh] font-black text-blue-400 uppercase tracking-[0.2em] mb-[0.5vh] drop-shadow-[0_0_1.5vh_rgba(59,130,246,0.5)]">Famille A</span>
                  <div className="flex items-center space-x-[1vw] bg-zinc-900/90 rounded-[1.5vh] border border-white/10 p-[0.6vh] shadow-2xl">
                    <button onClick={() => setScoreA(s => Math.max(0, s - 1))} className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90">
                      <MinusIcon className="w-[2.5vh] h-[2.5vh]" />
                    </button>
                    <span className="text-[5vh] font-black text-white w-[8vh] text-center tracking-tighter drop-shadow-[0_0_2vh_rgba(255,255,255,0.3)] leading-none">{scoreA}</span>
                    <button onClick={() => setScoreA(s => s + 1)} className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90">
                      <PlusIcon className="w-[2.5vh] h-[2.5vh]" />
                    </button>
                  </div>
                </div>
                {/* Strikes for A */}
                <div className="flex space-x-[0.5vw]">
                  {strikesA.map((active, i) => (
                    <button key={i} onClick={() => toggleStrikeA(i)} className={`w-[5vh] h-[5vh] rounded-full border-[0.3vh] transition-all duration-300 flex items-center justify-center shadow-xl ${active ? 'bg-red-600/95 border-red-400 shadow-red-900/50 scale-105 ring-[0.5vh] ring-red-500/20' : 'bg-zinc-800/60 border-zinc-700/40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}>
                      <XMarkIcon className={`w-[3vh] h-[3vh] font-black ${active ? 'text-white' : 'text-zinc-700'}`} strokeWidth={4} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Divider */}
              <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

              {/* Family B Section - Takes 1/2 of space */}
              <div className="flex-1 flex items-center justify-center space-x-[2vw] px-[2%] h-full">
                {/* Strikes for B */}
                <div className="flex space-x-[0.5vw]">
                  {strikesB.map((active, i) => (
                    <button key={i} onClick={() => toggleStrikeB(i)} className={`w-[5vh] h-[5vh] rounded-full border-[0.3vh] transition-all duration-300 flex items-center justify-center shadow-xl ${active ? 'bg-red-600/95 border-red-400 shadow-red-900/50 scale-105 ring-[0.5vh] ring-red-500/20' : 'bg-zinc-800/60 border-zinc-700/40 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}>
                      <XMarkIcon className={`w-[3vh] h-[3vh] font-black ${active ? 'text-white' : 'text-zinc-700'}`} strokeWidth={4} />
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center h-full py-[1vh]">
                  <span className="text-[2vh] font-black text-blue-400 uppercase tracking-[0.2em] mb-[0.5vh] drop-shadow-[0_0_1.5vh_rgba(59,130,246,0.5)]">Famille B</span>
                  <div className="flex items-center space-x-[1vw] bg-zinc-900/90 rounded-[1.5vh] border border-white/10 p-[0.6vh] shadow-2xl">
                    <button onClick={() => setScoreB(s => Math.max(0, s - 1))} className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90">
                      <MinusIcon className="w-[2.5vh] h-[2.5vh]" />
                    </button>
                    <span className="text-[5vh] font-black text-white w-[8vh] text-center tracking-tighter drop-shadow-[0_0_2vh_rgba(255,255,255,0.3)] leading-none">{scoreB}</span>
                    <button onClick={() => setScoreB(s => s + 1)} className="p-[0.5vh] hover:bg-white/10 rounded-[1vh] text-zinc-400 hover:text-white transition-all active:scale-90">
                      <PlusIcon className="w-[2.5vh] h-[2.5vh]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Studio Decorations */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-r-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-l-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default App;
