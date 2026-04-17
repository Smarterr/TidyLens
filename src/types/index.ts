// src/types/index.ts
import { Asset } from 'expo-media-library';

export interface SortedImage extends Asset {
  fileSizeMB: number; // We will calculate and store the size in MB
}