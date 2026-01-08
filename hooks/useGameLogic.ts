
import { useState, useEffect, useCallback } from 'react';
import yaml from 'js-yaml';
import { GameItem, End } from '../types';

export const useGameLogic = () => {
  const [items, setItems] = useState<GameItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false, false, false, false]); // Increased buffer
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Team State
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [strikesA, setStrikesA] = useState([false, false, false]);
  const [strikesB, setStrikesB] = useState([false, false, false]);

  // Load Data
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./questions.yaml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const yamlText = await response.text();
        const data = yaml.load(yamlText) as GameItem[];
        
        // Hardcode the End slide logic here since it was removed from YAML
        const endSlide: End = {
          type: 'end',
          title: "Terminé",
          subtitle: "Merci d'avoir joué"
        };

        setItems([...data, endSlide]);
        setError(null);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Could not load the survey data. Please ensure questions.yaml is available.");
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  // Actions
  const resetStrikes = () => {
    setStrikesA([false, false, false]);
    setStrikesB([false, false, false]);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
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
      
      const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
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
    currentItem: currentIndex >= 0 ? items[currentIndex] : null,
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
