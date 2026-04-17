// src/types/index.ts
import { Asset } from 'expo-media-library';

export interface SortedImage extends Asset {
  fileSizeMB: number;
}

// Add this!
export type FilterType = 'Largest' | 'Videos' | 'Screenshots' | 'Oldest';