// src/hooks/usePhotos.ts
import { useState, useEffect, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { SortedImage, FilterType } from '../types';
import { bytesToMB } from '../utils/formatSize';

export const usePhotos = (hasPermission: boolean, filter: FilterType) => {
  const [photos, setPhotos] = useState<SortedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPhotos = useCallback(async () => {
    if (!hasPermission) return;
    setLoading(true);
    
    try {
      let assetsOptions: MediaLibrary.AssetsOptions = {
        first: 100, // We start with 100 for speed
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: filter === 'Videos' ? ['video'] : ['photo'],
      };

      // Handle "Oldest" sorting
      if (filter === 'Oldest') {
        assetsOptions.sortBy = [[MediaLibrary.SortBy.creationTime, false]];
      }

      // Handle "Screenshots" - We have to find the specific album first
      if (filter === 'Screenshots') {
        const albums = await MediaLibrary.getAlbumsAsync();
        const screenshotAlbum = albums.find(a => a.title === 'Screenshots' || a.title === 'Recent');
        if (screenshotAlbum) {
          assetsOptions.album = screenshotAlbum;
        }
      }

      const media = await MediaLibrary.getAssetsAsync(assetsOptions);

      const processedPhotos: SortedImage[] = await Promise.all(
        media.assets.map(async (asset) => {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          const sizeInBytes = fileInfo.exists ? (fileInfo as any).size : 0;
          return {
            ...asset,
            fileSizeMB: bytesToMB(sizeInBytes),
          };
        })
      );

      // Final sorting for "Largest" (Default behavior)
      if (filter === 'Largest' || filter === 'Videos' || filter === 'Screenshots') {
        processedPhotos.sort((a, b) => b.fileSizeMB - a.fileSizeMB);
      }

      setPhotos(processedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, [hasPermission, filter]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // We return setPhotos so the HomeScreen can manually remove deleted items
  return { photos, loading, setPhotos, refresh: loadPhotos };
};