import { DesignPreset } from "./types";

export const MAX_IMAGE_DIMENSION = 1024;

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'modern-slate',
    label: 'Modern Slate',
    prompt: 'modern dark grey rectangular slate tiles with minimal grout',
    thumbnailClass: 'bg-slate-700'
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    prompt: 'warm mediterranean terracotta paving stones',
    thumbnailClass: 'bg-orange-700'
  },
  {
    id: 'herringbone-brick',
    label: 'Herringbone Brick',
    prompt: 'classic red brick laid in a herringbone pattern',
    thumbnailClass: 'bg-red-800'
  },
  {
    id: 'polished-concrete',
    label: 'Polished Concrete',
    prompt: 'smooth industrial polished concrete',
    thumbnailClass: 'bg-gray-400'
  },
  {
    id: 'cobblestone',
    label: 'Cobblestone',
    prompt: 'rustic european cobblestone pathway',
    thumbnailClass: 'bg-stone-600'
  },
  {
    id: 'luxury-marble',
    label: 'Luxury Marble',
    prompt: 'white carrara marble tiles with subtle grey veining',
    thumbnailClass: 'bg-white border border-gray-300'
  }
];