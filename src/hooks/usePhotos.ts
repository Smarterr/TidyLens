import { useState, useEffect, useCallback, useMemo } from 'react';
import { SortedImage, FilterType } from '../types';
import { getPhotos } from '../../modules/native-photos'; 

export const usePhotos = (hasPermission: boolean, filter: FilterType, includeICloud: boolean) => {
  const [masterPhotos, setMasterPhotos] = useState<SortedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('Preparing scan...');

  const performDeepScan = useCallback(async () => {
    if (!hasPermission) return;
    setLoading(true);

    try {
      setScanStatus('Running native hardware scan...');
      // Swift fetches everything ONCE. 
      const allProcessedPhotos = await getPhotos(true);
      setScanStatus('Finalizing...');
      setMasterPhotos(allProcessedPhotos);
    } catch (error) {
      console.error("Error scanning library:", error);
    } finally {
      setLoading(false);
    }
  }, [hasPermission]);

  // 1. THE BURST ALGORITHM
  // We calculate this once, instantly, completely offloading the work from the Swift thread.
  const similarPhotosList = useMemo(() => {
    // Only look at physical photos (not videos, not screenshots)
    let onlyPhotos = masterPhotos.filter(p => p.mediaType === 'photo' && !(p as any).isScreenshot && (includeICloud || !p.isICloud));
    
    // Sort chronologically
    onlyPhotos.sort((a, b) => a.creationTime - b.creationTime);
    
    let similarPhotos: SortedImage[] = [];
    let currentGroup: SortedImage[] = [];
    let groupIdCounter = 0;

    for (let i = 0; i < onlyPhotos.length; i++) {
        if (currentGroup.length === 0) {
            currentGroup.push(onlyPhotos[i]);
        } else {
            const prev = currentGroup[currentGroup.length - 1];
            // If taken within 2.5 seconds (2500ms) of the last photo, it's a burst!
            if (Math.abs(onlyPhotos[i].creationTime - prev.creationTime) <= 2500) {
                currentGroup.push(onlyPhotos[i]);
            } else {
                // Time gap is too large. If we caught a group, save it.
                if (currentGroup.length > 1) {
                    const groupId = `burst_${groupIdCounter++}`;
                    similarPhotos.push(...currentGroup.map(p => ({...p, similarGroupId: groupId})));
                }
                // Start a new group
                currentGroup = [onlyPhotos[i]];
            }
        }
    }
    // Catch the final group at the end of the loop
    if (currentGroup.length > 1) {
        const groupId = `burst_${groupIdCounter++}`;
        similarPhotos.push(...currentGroup.map(p => ({...p, similarGroupId: groupId})));
    }
    
    // Reverse it so your newest bursts are at the top of the grid
    return similarPhotos.reverse();
  }, [masterPhotos, includeICloud]);

  // 2. STATS CALCULATOR
  const stats = useMemo(() => {
    let videoCount = 0, videoSize = 0;
    let screenCount = 0, screenSize = 0;
    let localSize = 0, icloudSize = 0;

    masterPhotos.forEach(p => {
      if (!includeICloud && p.isICloud) return;
      
      if (p.isICloud) icloudSize += p.fileSizeMB;
      else localSize += p.fileSizeMB;

      if (p.mediaType === 'video') { videoCount++; videoSize += p.fileSizeMB; }
      if ((p as any).isScreenshot) { screenCount++; screenSize += p.fileSizeMB; }
    });

    const similarSize = similarPhotosList.reduce((sum, p) => sum + p.fileSizeMB, 0);

    return {
      totalSize: ((localSize + icloudSize) / 1024).toFixed(2),
      localSize: (localSize / 1024).toFixed(2),     
      icloudSize: (icloudSize / 1024).toFixed(2),   
      videos: { count: videoCount, size: videoSize > 1024 ? (videoSize/1024).toFixed(2) + ' GB' : videoSize.toFixed(0) + ' MB' },
      screenshots: { count: screenCount, size: screenSize > 1024 ? (screenSize/1024).toFixed(2) + ' GB' : screenSize.toFixed(0) + ' MB' },
      similar: { count: similarPhotosList.length, size: similarSize > 1024 ? (similarSize/1024).toFixed(2) + ' GB' : similarSize.toFixed(0) + ' MB' },
      largest: { count: masterPhotos.length, size: (localSize + icloudSize) > 1024 ? ((localSize + icloudSize)/1024).toFixed(2) + ' GB' : (localSize + icloudSize).toFixed(0) + ' MB' }
    };
  }, [masterPhotos, includeICloud, similarPhotosList]);

  // 3. FINAL GRID OUTPUT
  const filteredAndSortedPhotos = useMemo(() => {
    if (filter === 'Similar') return similarPhotosList;

    let result = masterPhotos.filter(p => includeICloud || !p.isICloud);
    if (filter === 'Videos') result = result.filter(asset => asset.mediaType === 'video');
    else if (filter === 'Screenshots') result = result.filter(asset => (asset as any).isScreenshot);
    
    if (filter === 'Oldest') result.sort((a, b) => a.creationTime - b.creationTime);
    else result.sort((a, b) => b.fileSizeMB - a.fileSizeMB);
    
    return result;
  }, [masterPhotos, filter, includeICloud, similarPhotosList]);

  const removeDeletedPhotos = (deletedIds: string[]) => {
    setMasterPhotos(prev => prev.filter(p => !deletedIds.includes(p.id)));
  };

  return { photos: filteredAndSortedPhotos, stats, loading, scanStatus, removeDeletedPhotos };
};