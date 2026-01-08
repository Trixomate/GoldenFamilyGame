
import { useState, useEffect, useCallback } from 'react';
import { GameItem } from '../types';
import { loadQuestions } from '../services/yamlLoader';

export const useGameLogic = () => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false, false, false, false]); // Buffer for up to 8 answers
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Team State
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [strikesA, setStrikesA] = useState([false, false, false]);
  const [strikesB, setStrikesB] = useState([false, false, false]);

  // Load Data via Service
  useEffect(() => {
    const initGame = async () => {
      try {
        setIsLoading(true);
        const data = await loadQuestions();
        setItems(data);
        setError(null);
      } catch (err) {
        setError("Could not load the survey data. Please ensure questions.yaml is available.");
      } finally {
        setIsLoading(false);
      }
    };
    initGame();
  }, []);

  // Actions
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
    if (currentIndex >= 0) {
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
  }, [currentIndex, items, handleNext, handlePrev, toggleReveal]);

  return {
    items,
    currentIndex,
    // currentItem is null if index is out of bounds (Intro or End)
    currentItem: (currentIndex >= 0 && currentIndex < items.length) ? items[currentIndex] : null,
    revealed,
    isTransitioning,
    isLoading,
    error,
    teams: {
      A: { score: scoreA, setScore: setScoreA, strikes: strikesA, toggleStrike: (i: number) => toggleStrike('A', i) },
      B: { score: scoreB, setScore: setScoreB, strikes: strikesB, toggleStrike: (i: number) => toggleStrike('B', i) },
    },
    actions: {
      handleNext,
      handlePrev,
      toggleReveal,
    }
  };
};
