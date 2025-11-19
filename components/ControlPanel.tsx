import React, { useState } from 'react';
import { Wand2, Sparkles, ChevronRight } from 'lucide-react';
import { DESIGN_PRESETS } from '../constants';
import { AppState } from '../types';

interface ControlPanelProps {
  appState: AppState;
  onGenerate: (prompt: string) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ appState, onGenerate, onReset }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!customPrompt.trim()) return;
    onGenerate(customPrompt);
  };

  const isLoading = appState === AppState.LOADING;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-2xl shadow-2xl mt-6 sticky bottom-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Design Prompt</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe the new flooring (e.g. 'rustic pine wood deck', 'checkerboard tiles')..."
          className="flex-1 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <button
          type="button" // Changed to button to prevent form submit default unless intentional
          onClick={() => handleSubmit()}
          disabled={!customPrompt.trim() || isLoading}
          className={`
            px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20
            ${!customPrompt.trim() || isLoading
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/30 hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Wand2 className="w-4 h-4" /> Generate
            </>
          )}
        </button>
      </form>

      <div className="space-y-3">
        <p className="text-xs text-neutral-500 font-medium">OR CHOOSE A PRESET</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setCustomPrompt(preset.prompt)}
              className="group relative p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-750 transition-all text-left flex flex-col gap-2 overflow-hidden"
            >
              <div className={`w-full h-12 rounded-md ${preset.thumbnailClass} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <span className="text-xs text-neutral-300 font-medium truncate w-full block">{preset.label}</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-black/50 rounded-full p-0.5">
                    <ChevronRight className="w-3 h-3 text-white"/>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {appState === AppState.SUCCESS && (
           <div className="mt-4 pt-4 border-t border-neutral-800 text-center">
               <button onClick={onReset} className="text-sm text-neutral-400 hover:text-white underline decoration-neutral-700 hover:decoration-white transition-all">
                   Upload a new photo
               </button>
           </div>
      )}
    </div>
  );
};