
import React, { useState, useRef } from 'react';
import { DocumentTextIcon, PlayCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { loadQuestions, parseYamlContent } from '../../services/yamlLoader';
import { GameItem } from '../../types';

interface SetupSlideProps {
  onStart: (data: GameItem[]) => void;
}

export const SetupSlide: React.FC<SetupSlideProps> = ({ onStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<GameItem[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!parsedData) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    setIsLoading(true);
    setParsedData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = parseYamlContent(content);
        // Simulate parse delay for UX
        setTimeout(() => {
          setParsedData(data);
          setIsLoading(false);
        }, 600);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (parsedData) return; // Disable drop if already loaded
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUseDefault = async () => {
    setError(null);
    setIsLoading(true);
    setParsedData(null);
    try {
      const data = await loadQuestions(); // Loads from default public/questions.yaml
      setTimeout(() => {
        setParsedData(data);
        setIsLoading(false);
      }, 600);
    } catch (err: any) {
      setError("Could not load default questions.yaml. " + err.message);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setParsedData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-20 bg-black/40 backdrop-blur-md">
      
      {/* Title */}
      <div className="mb-[4vh] text-center">
        <h1 className="text-[5vh] px-[2vw] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-lg uppercase">
          Game Setup
        </h1>
        <p className="text-blue-200/60 text-[2vh] mt-[1vh] font-light">
          {parsedData 
            ? <span className="text-green-400 font-bold tracking-wide">CONFIGURATION VALIDATED</span>
            : <span>Upload your <code className="bg-blue-900/30 px-2 py-0.5 rounded text-blue-100">.yaml</code> file to begin</span>
          }
        </p>
      </div>

      {/* Main Content Area: Switch between DropZone and Success State */}
      <div className="relative w-[50vw] h-[35vh]">
        
        {parsedData ? (
          // Success State
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/20 border border-green-500/30 rounded-[3vh] backdrop-blur-sm animate-in zoom-in-95 duration-300">
             <CheckCircleIcon className="w-[8vh] h-[8vh] text-green-400 mb-[2vh]" />
             <h3 className="text-[2.5vh] font-bold text-white mb-[1vh]">File Loaded Successfully</h3>
             <p className="text-green-200/70 mb-[4vh]">
                Found {parsedData.filter(i => !i.type || i.type === 'question').length} Questions & {parsedData.filter(i => i.type === 'transition').length} Rounds
             </p>
             
             <button 
                onClick={() => onStart(parsedData)}
                className="group relative flex items-center space-x-[1.5vw] px-[4vw] py-[2vh] bg-green-600 hover:bg-green-500 text-white rounded-[1.5vh] shadow-[0_0_3vh_rgba(34,197,94,0.4)] hover:shadow-[0_0_5vh_rgba(34,197,94,0.6)] transition-all active:scale-95"
             >
                <PlayCircleIcon className="w-[3.5vh] h-[3.5vh]" />
                <span className="text-[2.2vh] font-black tracking-wider uppercase">Launch Game</span>
             </button>

             <button 
                onClick={handleReset}
                className="absolute top-[2vh] right-[2vh] text-green-200/50 hover:text-white transition-colors flex items-center space-x-1 text-sm bg-black/20 px-3 py-1 rounded-full hover:bg-black/40"
             >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Change File</span>
             </button>
          </div>
        ) : (
          // Upload State
          <div 
            className={`
              w-full h-full rounded-[3vh] border-[0.4vh] border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
              ${isDragging 
                ? 'border-blue-400 bg-blue-500/10 scale-105 shadow-[0_0_5vh_rgba(59,130,246,0.3)]' 
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }
              ${error ? 'border-red-500/50 bg-red-500/5' : ''}
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
            
            {isLoading ? (
              <div className="flex flex-col items-center space-y-[2vh]">
                 <div className="w-[6vh] h-[6vh] border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                 <span className="text-blue-200 font-mono animate-pulse">PARSING CONFIG...</span>
              </div>
            ) : (
              <>
                <DocumentTextIcon className={`w-[8vh] h-[8vh] mb-[2vh] transition-colors ${isDragging ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <div className="text-center space-y-[1vh]">
                  <p className="text-[2.5vh] font-bold text-zinc-300 group-hover:text-white">
                    Drag & drop questions.yaml
                  </p>
                  <p className="text-[1.8vh] text-zinc-500 group-hover:text-zinc-400">
                    or click to browse
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && !parsedData && (
        <div className="w-[50vw] mt-[2vh] p-[2vh] bg-red-950/40 border border-red-500/30 rounded-[1.5vh] flex items-start space-x-[1.5vw] animate-in slide-in-from-top-2 fade-in">
          <ExclamationTriangleIcon className="w-[3vh] h-[3vh] text-red-400 shrink-0 mt-[0.5vh]" />
          <div className="flex-1">
             <h3 className="text-red-300 font-bold text-[1.8vh] uppercase tracking-wide mb-1">Configuration Error</h3>
             <p className="text-red-200/80 text-[1.6vh] font-mono whitespace-pre-wrap">{error}</p>
          </div>
        </div>
      )}

      {/* Default Button (Only show if not parsed yet) */}
      {!parsedData && (
        <>
          <div className="w-[50vw] flex items-center space-x-[2vw] my-[4vh] opacity-50">
            <div className="h-px bg-white/20 flex-1" />
            <span className="text-white/40 uppercase tracking-widest text-sm">OR</span>
            <div className="h-px bg-white/20 flex-1" />
          </div>

          <button 
            onClick={handleUseDefault}
            disabled={isLoading}
            className="flex items-center space-x-[1vw] px-[3vw] py-[1.5vh] rounded-[1.5vh] bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="w-[3vh] h-[3vh]" />
            <span className="font-bold tracking-wide text-[1.8vh]">Load Default Demo Game</span>
          </button>
        </>
      )}

    </div>
  );
};
