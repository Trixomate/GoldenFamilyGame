
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { Question, Transition, End } from './types';

// Components
import { LoadingScreen, ErrorScreen } from './components/StatusScreens';
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
  const isQuestion = currentItem?.type === 'question' || (currentItem && !currentItem.type);
  const isTransition = currentItem?.type === 'transition';
  const isEnd = currentItem?.type === 'end';

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
          totalItems={items.length} 
          onPrev={actions.handlePrev} 
          onNext={actions.handleNext}
          showTitle={!isTransition}
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 relative overflow-hidden z-10">
        <div className={`w-full h-full relative transition-all duration-500 transform ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          {isIntro && <IntroSlide onStart={actions.handleNext} />}
          
          {isTransition && <TransitionSlide item={currentItem as Transition} />}
          
          {isQuestion && (
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
              item={currentItem as End} 
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
