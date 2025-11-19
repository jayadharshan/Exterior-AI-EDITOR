export interface GeneratedImage {
  id: string;
  originalUrl: string;
  generatedUrl: string;
  prompt: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface DesignPreset {
  id: string;
  label: string;
  prompt: string;
  thumbnailClass: string; // Tailwind class for color/pattern preview
}