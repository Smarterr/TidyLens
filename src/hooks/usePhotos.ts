import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SortedImage, FilterType } from '../types';
import { getPhotos } from '../../modules/native-photos'; 

export const usePhotos = (hasPermission: boolean, filter: FilterType, includeICloud: boolean) => {
  const [masterPhotos, setMasterPhotos] = useState<SortedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('Preparing scan...');

  const cachedAll = useRef<SortedImage[]>([]);
  const cachedLocal = useRef<SortedImage[]>([]);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const [hasFetchedLocal, setHasFetchedLocal] = useState(false);

  const performDeepScan = useCallback(async () => {
    if (!hasPermission) return;

    if (includeICloud && hasFetchedAll) {
      setMasterPhotos(cachedAll.current);
      return; 
    }
    if (!includeICloud) {
      if (hasFetchedAll) {
        setMasterPhotos(cachedAll.current.filter(p => !p.isICloud));
        return;
      }
      if (hasFetchedLocal) {
        setMasterPhotos(cachedLocal.current);
        return;
      }
    }

    setLoading(true);

    try {
      setScanStatus('Running native hardware scan...');
      const allProcessedPhotos = await getPhotos(includeICloud);
      setScanStatus('Finalizing...');

      if (includeICloud) {
        cachedAll.current = allProcessedPhotos;
        setHasFetchedAll(true);
      } else {
        cachedLocal.current = allProcessedPhotos;
        setHasFetchedLocal(true);
      }

      setMasterPhotos(allProcessedPhotos);
    } catch (error) {
      console.error("Error scanning library:", error);
    } finally {
      setLoading(false);
    }
  }, [hasPermission, includeICloud, hasFetchedAll, hasFetchedLocal]);

  useEffect(() => {
    performDeepScan();
  }, [performDeepScan]);

  const similarPhotosList = useMemo(() => {
    let onlyPhotos = masterPhotos.filter(p => p.mediaType === 'photo' && !(p as any).isScreenshot);
    onlyPhotos.sort((a, b) => a.creationTime - b.creationTime);
    
    let similarPhotos: SortedImage[] = [];
    let currentGroup: SortedImage[] = [];
    let groupIdCounter = 0;

    for (let i = 0; i < onlyPhotos.length; i++) {
        if (currentGroup.length === 0) {
            currentGroup.push(onlyPhotos[i]);
        } else {
            const prev = currentGroup[currentGroup.length - 1];
            if (Math.abs(onlyPhotos[i].creationTime - prev.creationTime) <= 2500) {
                currentGroup.push(onlyPhotos[i]);
            } else {
                if (currentGroup.length > 1) {
                    const groupId = `burst_${groupIdCounter++}`;
                    similarPhotos.push(...currentGroup.map(p => ({...p, similarGroupId: groupId})));
                }
                currentGroup = [onlyPhotos[i]];
            }
        }
    }
    if (currentGroup.length > 1) {
        const groupId = `burst_${groupIdCounter++}`;
        similarPhotos.push(...currentGroup.map(p => ({...p, similarGroupId: groupId})));
    }
    
    return similarPhotos.reverse();
  }, [masterPhotos]);

  // --- NEW: BLURRY / LOW QUALITY ALGORITHM ---
  const blurryPhotosList = useMemo(() => {
    // Flag photos under 0.3 MB (300 KB) as low-quality/blurry
    let lowQuality = masterPhotos.filter(
      p => p.mediaType === 'photo' && !(p as any).isScreenshot && p.fileSizeMB < 0.3
    );
    // Sort smallest (blurriest) to the top
    return lowQuality.sort((a, b) => a.fileSizeMB - b.fileSizeMB);
  }, [masterPhotos]);

  const stats = useMemo(() => {
    let videoCount = 0, videoSize = 0;
    let screenCount = 0, screenSize = 0;
    let localSize = 0, icloudSize = 0;

    masterPhotos.forEach(p => {
      if (p.isICloud) icloudSize += p.fileSizeMB;
      else localSize += p.fileSizeMB;

      if (p.mediaType === 'video') { videoCount++; videoSize += p.fileSizeMB; }
      if ((p as any).isScreenshot) { screenCount++; screenSize += p.fileSizeMB; }
    });

    const totalSize = localSize + icloudSize;
    const similarSize = similarPhotosList.reduce((sum, p) => sum + p.fileSizeMB, 0);
    const blurrySize = blurryPhotosList.reduce((sum, p) => sum + p.fileSizeMB, 0);

    return {
      totalSize: (totalSize / 1024).toFixed(2),
      localSize: (localSize / 1024).toFixed(2),     
      icloudSize: (icloudSize / 1024).toFixed(2),   
      videos: { count: videoCount, size: videoSize > 1024 ? (videoSize/1024).toFixed(2) + ' GB' : videoSize.toFixed(0) + ' MB' },
      screenshots: { count: screenCount, size: screenSize > 1024 ? (screenSize/1024).toFixed(2) + ' GB' : screenSize.toFixed(0) + ' MB' },
      similar: { count: similarPhotosList.length, size: similarSize > 1024 ? (similarSize/1024).toFixed(2) + ' GB' : similarSize.toFixed(0) + ' MB' }, 
      blurry: { count: blurryPhotosList.length, size: blurrySize > 1024 ? (blurrySize/1024).toFixed(2) + ' GB' : blurrySize.toFixed(0) + ' MB' }, // NEW
      largest: { count: masterPhotos.length, size: totalSize > 1024 ? (totalSize/1024).toFixed(2) + ' GB' : totalSize.toFixed(0) + ' MB' }
    };
  }, [masterPhotos, similarPhotosList, blurryPhotosList]);

  const filteredAndSortedPhotos = useMemo(() => {
    if (filter === 'Similar') return similarPhotosList; 
    if (filter === 'Blurry') return blurryPhotosList; // Route for the new button

    let result = [...masterPhotos];
    if (filter === 'Videos') result = result.filter(asset => asset.mediaType === 'video');
    else if (filter === 'Screenshots') result = result.filter(asset => (asset as any).isScreenshot);
    
    if (filter === 'Oldest') result.sort((a, b) => a.creationTime - b.creationTime);
    else result.sort((a, b) => b.fileSizeMB - a.fileSizeMB);
    
    return result;
  }, [masterPhotos, filter, similarPhotosList, blurryPhotosList]);

  const removeDeletedPhotos = (deletedIds: string[]) => {
    setMasterPhotos(prev => prev.filter(p => !deletedIds.includes(p.id)));
    cachedAll.current = cachedAll.current.filter(p => !deletedIds.includes(p.id));
    cachedLocal.current = cachedLocal.current.filter(p => !deletedIds.includes(p.id));
  };

  return { photos: filteredAndSortedPhotos, stats, loading, scanStatus, removeDeletedPhotos };
};