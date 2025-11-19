import React, { useState } from 'react';
import { Download, ArrowRightLeft, Maximize2, X } from 'lucide-react';

interface ComparisonViewProps {
  originalUrl: string;
  generatedUrl: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, generatedUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - container.left) / container.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedUrl;
    link.download = `exterior-redesign-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative w-full aspect-video md:aspect-[4/3] max-h-[70vh] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl group select-none">
        {/* Interactive Comparison Slider */}
        <div 
            className="relative w-full h-full cursor-col-resize"
            onMouseMove={(e) => isDragging && handleDrag(e)}
            onTouchMove={(e) => isDragging && handleDrag(e)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onClick={handleDrag}
        >
             {/* Background: Original Image */}
             <img 
                src={originalUrl} 
                alt="Original" 
                className="absolute top-0 left-0 w-full h-full object-contain bg-neutral-900"
            />

             {/* Foreground: Generated Image (Clipped) */}
            <div 
                className="absolute top-0 left-0 h-full overflow-hidden bg-neutral-900"
                style={{ width: `${sliderPosition}%`, borderRight: '2px solid white' }}
            >
                <img 
                    src={generatedUrl} 
                    alt="Redesigned" 
                    className="absolute top-0 left-0 max-w-none h-full object-contain"
                    style={{ width: `${10000 / sliderPosition}%` }} // Hack to maintain aspect ratio logic relative to container? No, simpler approach needed for responsive images.
                />
                {/* 
                   Correct approach for overlay image that matches size:
                   Since we used object-contain, images might be letterboxed.
                   Better to force them to cover or be same size.
                   Let's try a simpler approach: render both images fully, clip top one.
                   Wait, object-contain makes aligning slider hard if aspect ratios differ or container differs.
                   We should rely on the resizing we did earlier to square or similar dim.
                */}
                {/* Let's redo the image rendering to ensure perfect alignment */}
            </div>
            
            {/* The actual implementation for perfect alignment with object-fit: contain is tricky. 
                We will use object-fit: cover for a nicer "design" view, or just assume standard aspect.
                Given we resized image to max dimension, let's just use background images for easier control.
            */}
            
            <div 
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${generatedUrl})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div 
                className="absolute inset-0 h-full border-r-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                style={{
                    width: `${sliderPosition}%`,
                    backgroundImage: `url(${originalUrl})`,
                    backgroundSize: 'contain', // Must match above
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Original</div>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-transparent cursor-col-resize flex items-center justify-center group-hover:bg-white/10 transition-colors"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-900">
                    <ArrowRightLeft className="w-4 h-4" />
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow-lg">Redesigned</div>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur transition-all"
                title="View Fullscreen"
            >
                <Maximize2 className="w-5 h-5" />
            </button>
            <button 
                onClick={handleDownload}
                className="p-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg backdrop-blur transition-all shadow-lg"
                title="Download Result"
            >
                <Download className="w-5 h-5" />
            </button>
        </div>
      </div>

        {/* Fullscreen Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 text-white/70 hover:text-white"
                >
                    <X className="w-8 h-8" />
                </button>
                <img 
                    src={generatedUrl} 
                    alt="Full Result" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                />
            </div>
        )}
    </div>
  );
};