
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setRevealed([false, false, false]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setRevealed([false, false, false]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const toggleReveal = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
  };

  // Helper to get specialized button styles
  const getButtonStyles = (idx: number) => {
    switch (idx) {
      case 0: // Brighter Gold
        return {
          gradient: 'from-yellow-400 via-amber-500 to-amber-700',
          border: 'border-yellow-200/50',
          shadow: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.5)]',
          numText: 'text-yellow-100/40',
          revealedGradient: 'from-yellow-300 via-yellow-500 to-amber-600',
          revealedBorder: 'border-yellow-200',
          textColor: 'text-amber-950'
        };
      case 1: // Brighter Silver
        return {
          gradient: 'from-slate-100 via-slate-400 to-slate-600',
          border: 'border-white/60',
          shadow: 'hover:shadow-[0_0_40px_rgba(226,232,240,0.5)]',
          numText: 'text-white/40',
          revealedGradient: 'from-white via-slate-200 to-slate-400',
          revealedBorder: 'border-white',
          textColor: 'text-slate-900'
        };
      case 2: // Brighter Bronze
        return {
          gradient: 'from-orange-400 via-orange-600 to-orange-900',
          border: 'border-orange-300/40',
          shadow: 'hover:shadow-[0_0_40px_rgba(234,88,12,0.5)]',
          numText: 'text-orange-100/30',
          revealedGradient: 'from-orange-300 via-orange-500 to-orange-700',
          revealedBorder: 'border-orange-200',
          textColor: 'text-orange-950'
        };
      default:
        return {
          gradient: 'from-blue-500 via-blue-700 to-blue-900',
          border: 'border-white/20',
          shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
          numText: 'text-blue-200/20',
          revealedGradient: 'from-blue-400 via-blue-500 to-blue-600',
          revealedBorder: 'border-blue-300',
          textColor: 'text-blue-950'
        };
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === '1') toggleReveal(0);
      if (e.key === '2') toggleReveal(1);
      if (e.key === '3') toggleReveal(2);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Survey Board...</p>
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
      {/* Game Stage Container: Maintains 16:9 aspect ratio */}
      <div className="w-full max-w-6xl aspect-video bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-3xl shadow-[0_0_80px_rgba(30,27,75,0.4)] border border-white/10 flex flex-col relative overflow-hidden ring-1 ring-white/5">
        
        {/* Navigation Header */}
        <div className="h-20 flex items-center justify-between px-10 bg-black/30 backdrop-blur-xl border-b border-white/5 z-20">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
          >
            <ChevronLeftIcon className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold tracking-widest text-sm">PREVIOUS</span>
          </button>

          <div className="flex flex-col items-center text-center">
             <div className="flex items-center justify-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-black text-blue-400 tracking-[0.4em] uppercase">SURVEY SAYS</span>
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
             </div>
             <div className="mt-1 px-4 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-[10px] font-mono font-bold text-blue-300/80 uppercase">BOARD {currentIndex + 1} / {questions.length}</span>
             </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${currentIndex === questions.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5'}`}
          >
            <span className="font-bold tracking-widest text-sm">NEXT</span>
            <ChevronRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Slide Content */}
        <div className={`flex-1 flex transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          
          {/* Left Panel: Question Display */}
          <div className="w-1/2 p-16 flex items-center justify-center border-r border-white/5 relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10 animate-in fade-in slide-in-from-left-8 duration-700">
              {currentQuestion?.question}
            </h1>
          </div>

          {/* Right Panel: Interactive Answer Slots */}
          <div className="w-1/2 p-16 flex flex-col justify-center space-y-8 bg-black/10">
            {currentQuestion?.answers.map((answer, idx) => {
              const styles = getButtonStyles(idx);
              return (
                <div key={idx} className="relative h-24 perspective-1000 group">
                  {/* Unrevealed Button */}
                  <button
                    onClick={() => toggleReveal(idx)}
                    className={`
                      absolute inset-0 w-full h-full flex items-center justify-between px-10
                      rounded-2xl border-2 transition-all duration-700 transform-gpu cursor-pointer shadow-xl shadow-black/40
                      bg-gradient-to-b ${styles.gradient} ${styles.border} ${styles.shadow}
                      ${revealed[idx] 
                        ? 'rotate-x-180 opacity-0 pointer-events-none scale-90' 
                        : 'hover:-translate-y-1 active:scale-95'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-6">
                      <span className={`text-4xl font-black italic transition-colors ${styles.numText} group-hover:text-white/20`}>{idx + 1}</span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"></div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
                    </div>
                  </button>

                  {/* Revealed Answer Panel */}
                  <div className={`
                    absolute inset-0 w-full h-full flex items-center justify-between
                    bg-gradient-to-r ${styles.revealedGradient} rounded-2xl border-4 ${styles.revealedBorder} shadow-2xl
                    transition-all duration-700 transform-gpu backface-hidden overflow-hidden
                    ${revealed[idx] ? 'rotate-x-0 opacity-100 scale-100' : 'rotate-x-[-110deg] opacity-0 scale-75'}
                  `}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    
                    <span className={`relative z-10 pl-10 text-2xl md:text-3xl font-black ${styles.textColor} uppercase tracking-tighter drop-shadow-sm`}>
                      {answer.text}
                    </span>
                    
                    <div className="relative z-10 h-full flex items-center px-8 bg-black/10 border-l-2 border-white/20">
                      <span className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {answer.percentage}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono">ARROWS</kbd>
            <span className="text-[10px] font-bold tracking-widest uppercase">NAVIGATE</span>
        </div>
        <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono">1-3</kbd>
            <span className="text-[10px] font-bold tracking-widest uppercase">REVEAL</span>
        </div>
      </div>
    </div>
  );
};

export default App;
