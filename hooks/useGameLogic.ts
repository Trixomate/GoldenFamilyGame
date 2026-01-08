
import { useState, useEffect, useCallback } from 'react';
import yaml from 'js-yaml';
import { Question } from '../types';

export const useGameLogic = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
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

  // Actions
  const resetStrikes = () => {
    setStrikesA([false, false, false]);
    setStrikesB([false, false, false]);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setRevealed([false, false, false]);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        resetStrikes();
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex >= 0) {
      setIsTransitioning(true);
      setRevealed([false, false, false]);
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
      if (currentIndex >= 0) {
        if (e.key === '1') toggleReveal(0);
        if (e.key === '2') toggleReveal(1);
        if (e.key === '3') toggleReveal(2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleNext, handlePrev, toggleReveal]);

  return {
    questions,
    currentIndex,
    currentQuestion: currentIndex >= 0 ? questions[currentIndex] : null,
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
