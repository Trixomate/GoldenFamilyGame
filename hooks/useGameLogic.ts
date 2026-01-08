
import { useState, useEffect, useCallback } from 'react';
import { GameItem } from '../types';
import { loadQuestions } from '../services/yamlLoader';

export const useGameLogic = () => {
  const [items, setItems] = useState<GameItem[]>([]);
  
  // State: 'setup' -> 'intro' (-1) -> 'game' (0..n) -> 'end'
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false, false, false, false]); // Buffer for up to 8 answers
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Only used for internal async ops now
  const [error, setError] = useState<string | null>(null);

  // Team State
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [strikesA, setStrikesA] = useState([false, false, false]);
  const [strikesB, setStrikesB] = useState([false, false, false]);

  // Actions
  const startGame = useCallback((data: GameItem[]) => {
    setItems(data);
    setIsSetupMode(false);
    setCurrentIndex(-1); // Reset to Intro
    setError(null);
  }, []);

  const resetToSetup = useCallback(() => {
    setIsSetupMode(true);
    setItems([]);
    setCurrentIndex(-1);
    setScoreA(0);
    setScoreB(0);
    resetStrikes();
  }, []);

  const resetStrikes = () => {
    setStrikesA([false, false, false]);
    setStrikesB([false, false, false]);
  };

  const handleNext = useCallback(() => {
    // Allow index to go up to items.length (Virtual End State)
    if (currentIndex < items.length) {
      setIsTransitioning(true);
      setRevealed(new Array(8).fill(false));
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        resetStrikes();
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, items.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex >= -1) { // Allow going back to intro (-1)
      setIsTransitioning(true);
      setRevealed(new Array(8).fill(false));
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        resetStrikes();
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex]);

  const toggleReveal = useCallback((index: number) => {
    setRevealed(prev => {
      const next = [...prev];
      next[index] = true; // Only allow revealing, not hiding
      return next;
    });
  }, []);

  const toggleStrike = useCallback((team: 'A' | 'B', index: number) => {
    const setter = team === 'A' ? setStrikesA : setStrikesB;
    setter(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    if (isSetupMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      
      const currentItem = (currentIndex >= 0 && currentIndex < items.length) ? items[currentIndex] : null;
      if (currentItem && (!currentItem.type || currentItem.type === 'question')) {
         // Key 1-8 for answers (assuming max 8 answers for safety)
         const num = parseInt(e.key);
         if (!isNaN(num) && num >= 1 && num <= 8) {
            toggleReveal(num - 1);
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSetupMode, currentIndex, items, handleNext, handlePrev, toggleReveal]);

  return {
    items,
    isSetupMode,
    currentIndex,
    // currentItem is null if index is out of bounds (Intro or End)
    currentItem: (currentIndex >= 0 && currentIndex < items.length) ? items[currentIndex] : null,
    revealed,
    isTransitioning,
    isLoading,
    error,
    setError,
    teams: {
      A: { score: scoreA, setScore: setScoreA, strikes: strikesA, toggleStrike: (i: number) => toggleStrike('A', i) },
      B: { score: scoreB, setScore: setScoreB, strikes: strikesB, toggleStrike: (i: number) => toggleStrike('B', i) },
    },
    actions: {
      startGame,
      resetToSetup,
      handleNext,
      handlePrev,
      toggleReveal,
    }
  };
};
