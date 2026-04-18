// src/hooks/usePhotos.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SortedImage, FilterType } from '../types';
import { getPhotos } from '../../modules/native-photos'; // <-- Importing our custom Swift bridge!

export const usePhotos = (hasPermission: boolean, filter: FilterType, includeICloud: boolean) => {
  const [masterPhotos, setMasterPhotos] = useState<SortedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('Preparing scan...');
  const [hasScanned, setHasScanned] = useState(false);

  const performDeepScan = useCallback(async () => {
    if (!hasPermission || hasScanned) return;
    setLoading(true);

    try {
      setScanStatus('Running native hardware scan...');
      
      // ONE LINE OF CODE. The Swift engine grabs all 5,000+ photos instantly.
      const allProcessedPhotos = await getPhotos(includeICloud);

      setScanStatus('Finalizing...');
      setMasterPhotos(allProcessedPhotos);
      setHasScanned(true); 
    } catch (error) {
      console.error("Error scanning library:", error);
    } finally {
      setLoading(false);
    }
  }, [hasPermission, hasScanned, includeICloud]);

  useEffect(() => {
    performDeepScan();
  }, [performDeepScan]);

  const filteredAndSortedPhotos = useMemo(() => {
    let result = [...masterPhotos];

    if (!includeICloud) {
      result = result.filter(asset => !asset.isICloud);
    }
    if (filter === 'Videos') {
      result = result.filter(asset => asset.mediaType === 'video');
    } else if (filter === 'Screenshots') {
      // Look how easy filtering is now that Swift tagged them for us!
      result = result.filter(asset => (asset as any).isScreenshot);
    } 

    if (filter === 'Oldest') {
      result.sort((a, b) => a.creationTime - b.creationTime);
    } else {
      result.sort((a, b) => b.fileSizeMB - a.fileSizeMB);
    }

    return result;
  }, [masterPhotos, filter, includeICloud]);

  const removeDeletedPhotos = (deletedIds: string[]) => {
    setMasterPhotos(prev => prev.filter(p => !deletedIds.includes(p.id)));
  };

  // We removed estimatedTime because it's going to be too fast to need a timer!
  return { photos: filteredAndSortedPhotos, loading, scanStatus, removeDeletedPhotos };
};