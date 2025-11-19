import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { resizeImage } from '../utils/imageUtils';

interface UploadZoneProps {
  onImageSelected: (base64: string, mimeType: string, previewUrl: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const { base64, mimeType, previewUrl } = await resizeImage(file);
      onImageSelected(base64, mimeType, previewUrl);
    } catch (error) {
      console.error("Error processing image", error);
      alert("Failed to process image. Please try another.");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`
        w-full h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
        transition-all duration-300 cursor-pointer group relative overflow-hidden
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-500 hover:bg-neutral-800/50'
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      
      <div className="flex flex-col items-center gap-4 p-8 text-center z-10 pointer-events-none">
        <div className={`
          p-4 rounded-full bg-neutral-800 
          group-hover:scale-110 group-hover:bg-neutral-700 
          transition-all duration-300 shadow-xl
        `}>
          <Upload className="w-8 h-8 text-neutral-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Upload entrance photo</h3>
          <p className="text-neutral-400 max-w-xs mx-auto">
            Drag & drop or click to browse. Best results with clear, well-lit photos of entryways.
          </p>
        </div>
        <div className="flex gap-2 mt-2">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
              <ImageIcon className="w-3 h-3 mr-1"/> JPG
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
              <Camera className="w-3 h-3 mr-1"/> PNG
            </span>
        </div>
      </div>
      
      {/* Decorative Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};