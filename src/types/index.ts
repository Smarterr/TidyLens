// src/types/index.ts
export type FilterType = 'Largest' | 'Videos' | 'Screenshots' | 'Oldest' | 'Similar' | 'Blurry';

export interface SortedImage {
  id: string;
  uri: string;
  mediaType: 'photo' | 'video';
  creationTime: number;
  fileSizeMB: number;
  isICloud: boolean;
  isScreenshot?: boolean;
  similarGroupId?: string;
}