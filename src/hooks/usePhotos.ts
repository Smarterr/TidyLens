// src/hooks/usePhotos.ts
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { SortedImage } from '../types';
import { bytesToMB } from '../utils/formatSize';

export const usePhotos = (hasPermission: boolean) => {
  const [photos, setPhotos] = useState<SortedImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Don't try to fetch if we don't have permission yet
    if (!hasPermission) return;

    const loadPhotos = async () => {
      setLoading(true);
      try {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          first: 100, 
        });

        // We must use Promise.all because fetching file sizes is an async action
        const processedPhotos: SortedImage[] = await Promise.all(
          media.assets.map(async (asset) => {
            // Look up the physical file on the device
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            
            // If the file safely exists, grab its size, otherwise default to 0
            const sizeInBytes = fileInfo.exists ? fileInfo.size : 0;

            return {
              ...asset,
              fileSizeMB: bytesToMB(sizeInBytes),
            };
          })
        );

        // Sort the array by file size, largest first (descending order)
        processedPhotos.sort((a, b) => b.fileSizeMB - a.fileSizeMB);

        setPhotos(processedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [hasPermission]);

  return { photos, loading };
};