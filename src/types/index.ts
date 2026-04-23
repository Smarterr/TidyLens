import * as MediaLibrary from 'expo-media-library';

export type FilterType = 'Largest' | 'Videos' | 'Screenshots' | 'Oldest' | 'Similar'; // Added 'Similar'

export interface SortedImage {
  id: string;
  uri: string;
  mediaType: 'photo' | 'video';
  creationTime: number;
  fileSizeMB: number;
  isICloud: boolean;
  isScreenshot?: boolean;
  similarGroupId?: string; // We will use this later to draw visual boxes around bursts!
}