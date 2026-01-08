
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useGameLogic } from './hooks/useGameLogic';
import { AnswerCard } from './components/AnswerCard';
import { TeamControl } from './components/TeamControl';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    <p className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Broadcast...</p>
  </div>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Technical Difficulty</h2>
    <p className="text-zinc-400 max-w-md">{message}</p>
  </div>
);

const App: React.FC = () => {
  const { 
    questions, 
    currentIndex, 
    currentQuestion, 
    revealed, 
    isTransitioning, 
    isLoading, 
    error,
    teams,
    actions 
  } = useGameLogic();

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center overflow-hidden font-sans">
      <div 
        className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-[2vh] shadow-[0_0_10vh_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/5"
        style={{ width: '95vw', height: 'calc(95vw * 9 / 16)', maxHeight: '95vh', maxWidth: 'calc(95vh * 16 / 9)' }}
      >
        
        {/* --- HEADER --- */}
        <div className="h-[15%] shrink-0 flex items-center justify-between px-[5%] bg-black/40 backdrop-blur-2xl border-b border-white/10 z-30 relative">
          <div className="w-[20%] flex justify-start">
            <button 
              onClick={actions.handlePrev}
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
                  <h2 className="text-[5vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 drop-shadow-[0_0.5vh_1.5vh_rgba(59,130,246,0.3)]">
                    une FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]">OR</span>
                  </h2>
               </div>
             ) : (
               <div className="w-44 h-8" />
             )}
          </div>

          <div className="w-[20%] flex justify-end">
            {currentIndex >= 0 && (
              <button 
                onClick={actions.handleNext}
                disabled={currentIndex === questions.length - 1}
                className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === questions.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5 bg-blue-500/5'}`}
              >
                <span className="font-bold tracking-widest text-[1.4vh] uppercase">Suivant</span>
                <ChevronRightIcon className="w-[3vh] h-[3vh] transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>

        {/* --- GAME AREA --- */}
        <div className="flex-1 relative overflow-hidden z-10">
          <div className={`w-full h-full relative transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            {currentIndex === -1 ? (
              // INTRO SCREEN
              <div className="absolute inset-0 flex flex-col items-center justify-center p-[5%] text-center relative">
                <div className="z-10">
                  <h1 className="text-[12vh] font-black tracking-tighter italic leading-none mb-[2vh] drop-shadow-[0_2vh_2vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400">
                    une FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_2vh_rgba(250,204,21,0.5)]">OR</span>
                  </h1>
                  <p className="text-[3vh] text-zinc-400 font-light max-w-[80%] mx-auto mb-[6vh] tracking-wide">
                    Bienvenue au défi ultime des sondages. <br/>
                    Votre famille sait-elle ce que le <span className="text-white font-bold italic">monde</span> pense ?
                  </p>
                  <button onClick={actions.handleNext} className="group relative inline-flex items-center justify-center px-[6vw] py-[3vh] font-black text-[3vh] tracking-[0.2em] uppercase bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2vh] shadow-2xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">Commencer</span>
                    <ChevronRightIcon className="relative z-10 w-[3vh] h-[3vh] ml-[1vw] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ) : (
              // QUESTION BOARD
              <div className="absolute inset-0 flex w-full">
                {/* Left: Question Display */}
                <div className="w-1/2 flex flex-col items-center justify-start border-r border-white/5 relative group px-[4vw] py-[4vh]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />
                  
                  {/* Board Badge - Top */}
                  <div className="mb-[2vh] px-[2vw] py-[1vh] bg-blue-500/10 border border-blue-500/20 rounded-full z-10 shrink-0 backdrop-blur-sm">
                    <span className="text-[1.5vh] font-mono font-black text-blue-300 tracking-[0.3em] uppercase">
                      Board {currentIndex + 1} / {questions.length}
                    </span>
                  </div>
                  
                  {/* Question Text - Fills Remaining Space */}
                  <div className="flex-1 flex items-center justify-center w-full z-10">
                    <h1 className="text-[4.8vh] font-black leading-[1.1] text-center drop-shadow-[0_1vh_1vh_rgba(0,0,0,0.5)] uppercase break-words w-full">
                        {currentQuestion?.question}
                    </h1>
                  </div>
                </div>

                {/* Right: Answer Cards */}
                <div className="w-1/2 p-[5%] flex flex-col justify-center space-y-[2.5vh] bg-black/10 overflow-hidden">
                  {currentQuestion?.answers.map((answer, idx) => (
                    <AnswerCard 
                      key={idx} 
                      index={idx} 
                      answer={answer} 
                      revealed={revealed[idx]} 
                      onReveal={() => actions.toggleReveal(idx)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER / TEAM CONTROL --- */}
        {currentIndex >= 0 && (
          <div className="h-[15%] shrink-0 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center justify-between z-30 relative overflow-hidden">
            <TeamControl 
              name="Famille A" 
              score={teams.A.score} 
              setScore={teams.A.setScore} 
              strikes={teams.A.strikes} 
              toggleStrike={teams.A.toggleStrike} 
            />
            <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <TeamControl 
              name="Famille B" 
              score={teams.B.score} 
              setScore={teams.B.setScore} 
              strikes={teams.B.strikes} 
              toggleStrike={teams.B.toggleStrike} 
              reverse={true} 
            />
          </div>
        )}

        {/* --- BACKGROUND DECORATIONS --- */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-r-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-l-full pointer-events-none" />
      </div>
    </div>
  );
};

export default App;
