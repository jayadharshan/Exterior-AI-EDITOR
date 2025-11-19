import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ControlPanel } from './components/ControlPanel';
import { ComparisonView } from './components/ComparisonView';
import { generateFlooringDesign } from './services/geminiService';
import { AppState } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<{ base64: string; mimeType: string; url: string } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string, mimeType: string, previewUrl: string) => {
    setOriginalImage({ base64, mimeType, url: previewUrl });
    setGeneratedImageUrl(null);
    setAppState(AppState.IDLE);
    setError(null);
  }, []);

  const handleGenerate = async (prompt: string) => {
    if (!originalImage) return;

    setAppState(AppState.LOADING);
    setError(null);

    try {
      const resultBase64 = await generateFlooringDesign(originalImage.base64, prompt, originalImage.mimeType);
      setGeneratedImageUrl(resultBase64);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setAppState(AppState.ERROR);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImageUrl(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-sm hover:underline">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visualization Area */}
          <div className="lg:col-span-12">
            {!originalImage ? (
              <div className="max-w-3xl mx-auto mt-10">
                <UploadZone onImageSelected={handleImageSelected} />
                
                {/* Demo Note */}
                <div className="mt-8 text-center">
                    <p className="text-neutral-500 text-sm">
                        Try uploading a photo of a porch, driveway, or hallway.
                    </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {appState === AppState.LOADING && !generatedImageUrl && (
                   <div className="w-full aspect-video md:aspect-[4/3] max-h-[60vh] bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
                       <img src={originalImage.url} className="absolute inset-0 w-full h-full object-contain opacity-30 blur-sm" alt="Processing background"/>
                       <div className="z-10 flex flex-col items-center bg-black/60 p-8 rounded-2xl backdrop-blur-md border border-neutral-700">
                           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                           <h3 className="text-xl font-semibold text-white">Redesigning Surface...</h3>
                           <p className="text-neutral-400 mt-2">Analyzing architecture and applying new materials</p>
                       </div>
                   </div>
                )}

                {(appState === AppState.IDLE || (appState === AppState.LOADING && !generatedImageUrl) || appState === AppState.ERROR) && appState !== AppState.LOADING && (
                   <div className="relative w-full aspect-video md:aspect-[4/3] max-h-[60vh] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
                        <img 
                            src={originalImage.url} 
                            alt="Original" 
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Original Source</div>
                   </div>
                )}

                {generatedImageUrl && (
                    <ComparisonView originalUrl={originalImage.url} generatedUrl={generatedImageUrl} />
                )}

                {/* Controls */}
                <ControlPanel 
                    appState={appState} 
                    onGenerate={handleGenerate} 
                    onReset={handleReset}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;