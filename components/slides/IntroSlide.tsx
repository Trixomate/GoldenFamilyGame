
import React, { useState, useRef } from 'react';
import { ChevronRightIcon, ArrowUpTrayIcon, DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon, PlayCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { parseYamlContent, loadQuestions } from '../../services/yamlLoader';
import { GameItem } from '../../types';

interface IntroSlideProps {
  onStart: () => void;
  onDataUpdate: (data: GameItem[]) => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({ onStart, onDataUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Custom Game Loaded State (for Main Screen)
  const [loadedFileInfo, setLoadedFileInfo] = useState<{name: string, count: number} | null>(null);
  
  // Modal State
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<GameItem[] | null>(null);
  const [tempFileName, setTempFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- File Handling Logic ---
  const processFile = (file: File) => {
    setError(null);
    setSuccessData(null);
    setTempFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = parseYamlContent(content);
        setSuccessData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Called when user clicks "Load Game Data" in Modal
  const handleConfirmCustom = () => {
    if (successData) {
      onDataUpdate(successData);
      setLoadedFileInfo({ name: tempFileName, count: successData.length });
      closeModal();
    }
  };

  const handleStartDefault = async () => {
      try {
          const data = await loadQuestions();
          onDataUpdate(data);
          onStart();
      } catch (err) {
          console.error("Failed to load default questions", err);
          onStart(); // Try starting anyway (might rely on cached data)
      }
  };

  const closeModal = () => {
    setShowModal(false);
    setError(null);
    setSuccessData(null);
    setTempFileName("");
    setIsDragging(false);
  };

  const resetSelection = () => {
    setLoadedFileInfo(null);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center w-full h-full z-20 py-[10vh]">
      {/* 1. Title Section */}
      <div className="flex-1 flex items-end justify-center pb-[5vh]">
         <h1 className="text-[14vh] px-[2vw] font-black tracking-tighter italic leading-none drop-shadow-[0_2vh_4vh_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 scale-110">
          <span className="text-yellow-400 drop-shadow-[0_0_3vh_rgba(250,204,21,0.6)]">GOLDEN</span> FAMILY
        </h1>
      </div>

      {/* 2. Description */}
      <div className="flex-none py-[2vh] px-[10%]">
        <p className="text-[3.5vh] text-zinc-300 font-light text-center leading-relaxed tracking-wide drop-shadow-lg">
          Welcome to the ultimate survey challenge. <br/>
          Does your family know what the <span className="text-white font-bold italic">world</span> thinks?
        </p>
      </div>

      {/* 3. Main Actions - Consistent Side-by-Side Layout */}
      <div className="flex-1 flex items-start justify-center pt-[5vh] space-x-[4vw]">
        
        {/* Option 1: Default Game */}
        <button 
          onClick={handleStartDefault}
          className="group relative flex flex-col items-center justify-center w-[22vw] h-[22vh] rounded-[2.5vh] bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-blue-500/30 hover:border-blue-400/60 hover:from-blue-800/40 hover:to-blue-800/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_5vh_rgba(30,58,138,0.2)]"
        >
            <div className="p-[1.5vh] rounded-full bg-blue-500/10 mb-[1.5vh] group-hover:bg-blue-500/20 transition-colors">
               <PlayCircleIcon className="w-[5vh] h-[5vh] text-blue-400 group-hover:text-blue-100 transition-colors" />
            </div>
            <span className="text-[2.5vh] font-black uppercase tracking-widest text-white mb-[0.5vh] drop-shadow-md">Default Game</span>
            <span className="text-[1.6vh] font-mono text-blue-300/60 group-hover:text-blue-200/80">Demo questions</span>
        </button>

        {/* Option 2: Custom Game (Dynamic State) */}
        {!loadedFileInfo ? (
            /* State A: Upload */
            <button 
              onClick={() => setShowModal(true)}
              className="group relative flex flex-col items-center justify-center w-[22vw] h-[22vh] rounded-[2.5vh] bg-gradient-to-br from-zinc-800/40 to-zinc-900/20 border border-zinc-600/30 hover:border-zinc-400/60 hover:from-zinc-800/60 hover:to-zinc-800/40 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_5vh_rgba(0,0,0,0.2)]"
            >
                <div className="p-[1.5vh] rounded-full bg-zinc-500/10 mb-[1.5vh] group-hover:bg-zinc-500/20 transition-colors">
                  <ArrowUpTrayIcon className="w-[5vh] h-[5vh] text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </div>
                <span className="text-[2.5vh] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors mb-[0.5vh] drop-shadow-md">Custom Game</span>
                <span className="text-[1.6vh] font-mono text-zinc-500 group-hover:text-zinc-400">Upload YAML File</span>
            </button>
        ) : (
             /* State B: Ready to Start */
             <div className="relative group w-[22vw] h-[22vh]">
                <button 
                  onClick={onStart}
                  className="relative flex flex-col items-center justify-center w-full h-full rounded-[2.5vh] bg-gradient-to-br from-green-900/40 to-green-900/20 border border-green-500/40 hover:border-green-400/70 hover:from-green-800/40 hover:to-green-800/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_5vh_rgba(20,83,45,0.3)]"
                >
                    <div className="p-[1.5vh] rounded-full bg-green-500/10 mb-[1.5vh] group-hover:bg-green-500/20 transition-colors">
                       <CheckCircleIcon className="w-[5vh] h-[5vh] text-green-400 group-hover:text-green-100 transition-colors" />
                    </div>
                    <span className="text-[2.5vh] font-black uppercase tracking-widest text-white mb-[0.5vh] drop-shadow-md">Start Custom</span>
                    <span className="text-[1.6vh] font-mono text-green-300/80 truncate max-w-[90%] px-[1vw] text-center" title={`${loadedFileInfo.name} (${loadedFileInfo.count} items)`}>
                        {loadedFileInfo.name} <span className="text-green-300/50">({loadedFileInfo.count})</span>
                    </span>
                </button>
                
                {/* Reset Button (Absolute positioned on card corner) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); resetSelection(); }}
                    className="absolute top-[1.5vh] right-[1.5vh] z-20 p-[0.8vh] rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-red-500/80 hover:border-red-400 transition-all opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
                    title="Remove file"
                >
                    <XMarkIcon className="w-[2vh] h-[2vh]" />
                </button>
             </div>
        )}

      </div>

      {/* --- CUSTOM GAME MODAL --- */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-[50vw] bg-[#0f172a] border border-white/10 rounded-[3vh] shadow-2xl p-[4vh] animate-in zoom-in-95 duration-300 flex flex-col items-center">
            
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-[2vh] right-[2vh] p-[1vh] rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="w-[3vh] h-[3vh]" />
            </button>

            <h2 className="text-[3vh] font-black italic uppercase tracking-wider text-white mb-[1vh]">Upload Game Data</h2>
            <p className="text-zinc-400 text-[1.8vh] mb-[4vh] font-light">Drag and drop your <code className="text-blue-400 bg-blue-400/10 px-1 rounded">questions.yaml</code> file below.</p>

            {/* Drop Zone */}
            {!successData ? (
              <div 
                className={`
                  w-full min-h-[25vh] rounded-[2vh] border-[0.3vh] border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer mb-[2vh] p-[2vh]
                  ${isDragging 
                    ? 'border-blue-400 bg-blue-500/10 scale-[1.02] shadow-[0_0_3vh_rgba(59,130,246,0.2)]' 
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800'
                  }
                  ${error ? 'border-red-500/50 bg-red-900/10' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".yaml,.yml,.txt"
                  onChange={handleFileSelect}
                />
                
                {error ? (
                  <div className="flex flex-col items-center w-full">
                    <ExclamationTriangleIcon className="w-[6vh] h-[6vh] text-red-400 mb-[1.5vh]" />
                    <p className="text-red-300 font-bold text-[1.8vh] uppercase mb-[0.5vh]">Parsing Failed</p>
                    
                    {/* Formatted Error Message */}
                    <div className="w-full mt-[1vh] bg-red-950/50 border border-red-500/30 rounded-[1vh] p-[1.5vh] max-h-[15vh] overflow-y-auto text-left">
                        <p className="text-red-200/90 text-[1.4vh] font-mono whitespace-pre-wrap break-words leading-relaxed select-text">
                            {error}
                        </p>
                    </div>
                    
                    <p className="mt-[2vh] text-zinc-500 text-[1.4vh] underline">Click to try again</p>
                  </div>
                ) : (
                  <>
                    <DocumentTextIcon className={`w-[6vh] h-[6vh] mb-[2vh] transition-colors ${isDragging ? 'text-blue-400' : 'text-zinc-600'}`} />
                    <p className="text-zinc-300 font-bold text-[2vh]">Drop file here</p>
                    <p className="text-zinc-500 text-[1.6vh]">or click to browse</p>
                  </>
                )}
              </div>
            ) : (
              /* Success State inside Modal */
              <div className="w-full h-[25vh] rounded-[2vh] bg-green-500/10 border border-green-500/30 flex flex-col items-center justify-center mb-[2vh]">
                <CheckCircleIcon className="w-[8vh] h-[8vh] text-green-400 mb-[2vh]" />
                <h3 className="text-[2.2vh] font-bold text-white">File Validated!</h3>
                <p className="text-green-200/70 text-[1.6vh] mt-[0.5vh]">
                  Ready to load {successData.length} items from <span className="font-mono text-white/80">{tempFileName}</span>.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            {successData && (
              <button 
                onClick={handleConfirmCustom}
                className="w-full py-[2vh] bg-green-600 hover:bg-green-500 text-white rounded-[1.5vh] font-black tracking-widest uppercase text-[2vh] shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
              >
                Load Game Data
              </button>
            )}
            
            {/* Cancel Button */}
            {!successData && (
               <button 
               onClick={closeModal}
               className="mt-[2vh] text-zinc-500 hover:text-white text-[1.6vh] font-medium"
             >
               Cancel
             </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
