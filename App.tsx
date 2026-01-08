
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useGameLogic } from './hooks/useGameLogic';
import { AnswerCard } from './components/AnswerCard';
import { TeamControl } from './components/TeamControl';
import { Question, Transition, End } from './types';

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
    items, 
    currentIndex, 
    currentItem, 
    revealed, 
    isTransitioning, 
    isLoading, 
    error,
    teams,
    actions 
  } = useGameLogic();

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  // Type Guards
  const isQuestion = currentItem && (!currentItem.type || currentItem.type === 'question');
  const isTransition = currentItem && currentItem.type === 'transition';
  const isEnd = currentItem && currentItem.type === 'end';
  
  const questionItem = isQuestion ? currentItem as Question : null;
  const transitionItem = isTransition ? currentItem as Transition : null;
  const endItem = isEnd ? currentItem as End : null;

  // Calculate Board Number (excluding transitions and end slides)
  const questionNumber = items
    .slice(0, currentIndex + 1)
    .filter(i => !i.type || i.type === 'question')
    .length;
    
  const totalQuestions = items.filter(i => !i.type || i.type === 'question').length;

  // Determine Winner
  const winner = teams.A.score > teams.B.score ? 'Famille A' : (teams.B.score > teams.A.score ? 'Famille B' : 'Tie');
  const isTie = teams.A.score === teams.B.score;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center overflow-hidden font-sans">
      <div 
        className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-[2vh] shadow-[0_0_10vh_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/5"
        style={{ width: '95vw', height: 'calc(95vw * 9 / 16)', maxHeight: '95vh', maxWidth: 'calc(95vh * 16 / 9)' }}
      >
        
        {/* --- HEADER (Hidden on Intro and End) --- */}
        {currentIndex >= 0 && !isEnd && (
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
                 {!isTransition && (
                   <div className="flex items-center justify-center space-x-[1vw]">
                      <h2 className="text-[5vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 drop-shadow-[0_0.5vh_1.5vh_rgba(59,130,246,0.3)]">
                        une FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]">OR</span>
                      </h2>
                   </div>
                 )}
            </div>

            <div className="w-[20%] flex justify-end">
                <button 
                  onClick={actions.handleNext}
                  disabled={currentIndex === items.length - 1}
                  className={`group flex items-center space-x-[1vw] px-[2vw] py-[1.5vh] rounded-[1vh] transition-all duration-300 ${currentIndex === items.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95 border border-white/5 bg-blue-500/5'}`}
                >
                  <span className="font-bold tracking-widest text-[1.4vh] uppercase">Suivant</span>
                  <ChevronRightIcon className="w-[3vh] h-[3vh] transition-transform group-hover:translate-x-1" />
                </button>
            </div>
          </div>
        )}

        {/* --- GAME AREA --- */}
        <div className="flex-1 relative overflow-hidden z-10">
          <div className={`w-full h-full relative transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
            {currentIndex === -1 ? (
              // INTRO SCREEN
              <div className="absolute inset-0 flex flex-col items-center w-full h-full z-20 py-[10vh]">
                
                {/* 1. Title Section (Top Third) */}
                <div className="flex-1 flex items-end justify-center pb-[5vh]">
                   <h1 className="text-[14vh] font-black tracking-tighter italic leading-none drop-shadow-[0_2vh_4vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 scale-110">
                    une FAMILLE en <span className="text-yellow-400 drop-shadow-[0_0_3vh_rgba(250,204,21,0.6)]">OR</span>
                  </h1>
                </div>

                {/* 2. Description (Middle) */}
                <div className="flex-none py-[5vh] px-[10%]">
                  <p className="text-[3.5vh] text-zinc-300 font-light text-center leading-relaxed tracking-wide drop-shadow-lg">
                    Bienvenue au défi ultime des sondages. <br/>
                    Votre famille sait-elle ce que le <span className="text-white font-bold italic">monde</span> pense ?
                  </p>
                </div>

                {/* 3. Button (Bottom Third) */}
                <div className="flex-1 flex items-start justify-center pt-[5vh]">
                  <button onClick={actions.handleNext} className="group relative inline-flex items-center justify-center px-[8vw] py-[4vh] font-black text-[3.5vh] tracking-[0.25em] uppercase bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2.5vh] shadow-[0_1vh_4vh_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden ring-1 ring-white/20">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 drop-shadow-md">Commencer</span>
                    <ChevronRightIcon className="relative z-10 w-[4vh] h-[4vh] ml-[1.5vw] transition-transform group-hover:translate-x-1 stroke-[3]" />
                  </button>
                </div>

              </div>
            ) : isTransition ? (
              // TRANSITION SLIDE
              <div className="absolute inset-0 flex flex-col items-center w-full h-full relative z-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_80%)] -z-10" />
                
                {/* Top: Label */}
                <div className="mt-[10vh] flex-none">
                    <div className="text-[2vh] font-mono text-blue-300 tracking-[0.5em] uppercase border px-[2vw] py-[0.5vh] rounded-full border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
                      Prochain Thème
                    </div>
                </div>

                {/* Center: Title & Subtitle Grouped */}
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-[4vh] pb-[10vh]">
                    <h1 className="text-[12vh] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-300 drop-shadow-[0_0.5vh_2vh_rgba(0,0,0,0.8)] uppercase text-center max-w-[90%] leading-[1.1]">
                      {transitionItem?.title}
                    </h1>

                    {transitionItem?.subtitle && (
                      <p className="text-[5vh] text-blue-200/90 font-light tracking-wide text-center max-w-[80%]">
                        {transitionItem.subtitle}
                      </p>
                    )}
                </div>
              </div>
            ) : isEnd ? (
              // END SLIDE
              <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20 w-full h-full pb-[5vh]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15)_0%,transparent_70%)] -z-10" />
                
                <h1 className="text-[8vh] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500 drop-shadow-[0_1vh_2vh_rgba(0,0,0,0.8)] uppercase text-center mb-[4vh] opacity-80">
                  {endItem?.title}
                </h1>

                {/* Winner Display */}
                <div className="flex flex-col items-center animate-in zoom-in duration-700">
                    <div className="flex items-center space-x-[2vw] mb-[4vh]">
                        <TrophyIcon className="w-[6vh] h-[6vh] text-yellow-400 drop-shadow-[0_0_1.5vh_rgba(250,204,21,0.5)]" />
                        <span className="text-[3vh] font-mono text-yellow-200 tracking-[0.5em] uppercase">Le vainqueur est</span>
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
                             {/* Winner Name with specific team styling */}
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
                            
                            {/* Score Badge */}
                            <div className="mt-[4vh] px-[6vw] py-[2vh] bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-[2vh] border border-white/20 backdrop-blur-xl shadow-[0_1vh_3vh_rgba(0,0,0,0.4)] flex items-baseline space-x-[2vw]">
                                <span className="text-[8vh] font-black text-white drop-shadow-lg leading-none">
                                    {winner === 'Famille A' ? teams.A.score : teams.B.score}
                                </span>
                                <span className="text-[3vh] font-bold text-zinc-400 uppercase tracking-widest">Points</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Subtle back navigation for admin/safety */}
                <button 
                  onClick={actions.handlePrev}
                  className="absolute bottom-[5vh] left-[5vh] p-[2vh] text-white/10 hover:text-white/40 transition-colors rounded-full hover:bg-white/5"
                >
                    <ChevronLeftIcon className="w-[4vh] h-[4vh]" />
                </button>
              </div>
            ) : isQuestion ? (
              // QUESTION BOARD
              <div className="absolute inset-0 flex w-full">
                {/* Left: Question Display */}
                <div className="w-1/2 flex flex-col items-center justify-start border-r border-white/5 relative group px-[4vw] py-[4vh]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />
                  
                  {/* Board Badge - Top */}
                  <div className="mb-[2vh] px-[2vw] py-[1vh] bg-blue-500/10 border border-blue-500/20 rounded-full z-10 shrink-0 backdrop-blur-sm">
                    <span className="text-[1.5vh] font-mono font-black text-blue-300 tracking-[0.3em] uppercase">
                      Board {questionNumber} / {totalQuestions}
                    </span>
                  </div>
                  
                  {/* Question Text - Fills Remaining Space */}
                  <div className="flex-1 flex items-center justify-center w-full z-10">
                    <h1 className="text-[4.8vh] font-black leading-[1.1] text-center drop-shadow-[0_1vh_1vh_rgba(0,0,0,0.5)] uppercase break-words w-full">
                        {questionItem?.question}
                    </h1>
                  </div>
                </div>

                {/* Right: Answer Cards */}
                <div className="w-1/2 p-[5%] flex flex-col justify-center space-y-[2.5vh] bg-black/10 overflow-hidden">
                  {questionItem?.answers?.map((answer, idx) => (
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
            ) : null}
          </div>
        </div>

        {/* --- FOOTER / TEAM CONTROL (Hidden on Intro and End) --- */}
        {currentIndex >= 0 && !isEnd && (
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
