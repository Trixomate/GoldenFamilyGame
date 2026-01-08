
import React from 'react';

export const GameContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center overflow-hidden font-sans">
    <div 
      className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-[2vh] shadow-[0_0_10vh_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/5"
      style={{ width: '95vw', height: 'calc(95vw * 9 / 16)', maxHeight: '95vh', maxWidth: 'calc(95vh * 16 / 9)' }}
    >
      {/* Background Decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-r-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-[30%] bg-blue-500/20 blur-sm rounded-l-full pointer-events-none" />
      
      {children}
    </div>
  </div>
);
