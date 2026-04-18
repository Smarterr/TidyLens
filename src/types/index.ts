import * as MediaLibrary from 'expo-media-library';

export type FilterType = 'Largest' | 'Videos' | 'Screenshots' | 'Oldest';

export interface SortedImage extends MediaLibrary.Asset {
  fileSizeMB: number;
  isICloud?: boolean; // <-- Add this new property
}