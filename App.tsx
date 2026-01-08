
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Question, Transition } from './types';

// Components
import { LoadingScreen, ErrorScreen } from './components/ui/StatusScreens';
import { GameContainer } from './components/layout/GameContainer';
import { GameHeader } from './components/layout/GameHeader';
import { GameFooter } from './components/layout/GameFooter';
import { IntroSlide } from './components/slides/IntroSlide';
import { TransitionSlide } from './components/slides/TransitionSlide';
import { QuestionBoard } from './components/slides/QuestionBoard';
import { EndSlide } from './components/slides/EndSlide';

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

  // Type Guards & State Analysis
  const isIntro = currentIndex === -1;
  const isEnd = currentIndex === items.length;
  
  // Safe check for currentItem existence for middle states
  const isQuestion = !isIntro && !isEnd && (currentItem?.type === 'question' || (currentItem && !currentItem.type));
  const isTransition = !isIntro && !isEnd && currentItem?.type === 'transition';

  const questionNumber = items
    .slice(0, currentIndex + 1)
    .filter(i => !i.type || i.type === 'question')
    .length;
    
  const totalQuestions = items.filter(i => !i.type || i.type === 'question').length;

  return (
    <GameContainer>
      {/* Header: Hidden on Intro and End */}
      {!isIntro && !isEnd && (
        <GameHeader 
          currentIndex={currentIndex} 
          // Treat total items as length + 1 so navigation allows reaching the End state
          totalItems={items.length + 1} 
          onPrev={actions.handlePrev} 
          onNext={actions.handleNext}
          showTitle={true}
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 relative overflow-hidden z-10">
        <div className={`w-full h-full relative transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          {isIntro && <IntroSlide onStart={actions.handleNext} />}
          
          {isTransition && currentItem && <TransitionSlide item={currentItem as Transition} />}
          
          {isQuestion && currentItem && (
            <QuestionBoard 
              item={currentItem as Question} 
              revealed={revealed} 
              onReveal={actions.toggleReveal}
              boardNumber={questionNumber}
              totalBoards={totalQuestions}
            />
          )}
          
          {isEnd && (
            <EndSlide 
              teams={teams} 
              onBack={actions.handlePrev} 
            />
          )}
        </div>
      </div>

      {/* Footer: Hidden on Intro and End */}
      {!isIntro && !isEnd && <GameFooter teams={teams} />}
    </GameContainer>
  );
};

export default App;
