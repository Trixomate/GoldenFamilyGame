
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4 font-sans">
    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    <p className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Broadcast...</p>
  </div>
);

export const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center font-sans">
    <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-2xl font-bold text-white mb-2">Technical Difficulty</h2>
    <p className="text-zinc-400 max-w-md">{message}</p>
  </div>
);
