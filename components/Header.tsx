import React from 'react';
import { Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              ExteriOR
            </h1>
            <p className="text-xs text-neutral-500 font-medium tracking-wider">AI SURFACE DESIGNER</p>
          </div>
        </div>
        <div className="text-neutral-400 text-sm hidden sm:block">
          Powered by <span className="text-white font-semibold">Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};