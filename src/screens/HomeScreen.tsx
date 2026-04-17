// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { FlashList } from '@shopify/flash-list';
import { usePhotos } from '../hooks/usePhotos';
import ImageCard from '../components/ImageCard';
import FilterPills from '../components/FilterPills';
import { FilterType, SortedImage } from '../types';

import styles from './HomeScreen.Styles';

export default function HomeScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Largest');
  
  // FIX: Added 'activeFilter' as the 2nd argument and destuctured 'setPhotos'
  const { photos, loading, setPhotos } = usePhotos(hasPermission, activeFilter);

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      setHasPermission(true);
    }
  }, [permissionResponse]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    // Professional Deletion Flow
    Alert.alert(
      "Delete Photos",
      `Are you sure you want to delete ${selectedIds.length} items? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const assetsToDelete = photos.filter(p => selectedIds.includes(p.id));
              const success = await MediaLibrary.deleteAssetsAsync(assetsToDelete);
              
              if (success) {
                // OPTIMISTIC UI: Remove from the screen immediately so it feels fast
                setPhotos(prevPhotos => 
                  prevPhotos.filter(p => !selectedIds.includes(p.id))
                );
                setSelectedIds([]);
              }
            } catch (e) {
              Alert.alert("Error", "The OS blocked the deletion. This usually happens if the photo is synced to iCloud.");
            }
          }
        }
      ]
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>We need access to your photos!</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>TidyLens</Text>
          <Text style={styles.subtitle}>Free up space instantly</Text>
        </View>
        {selectedIds.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete ({selectedIds.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <FilterPills 
          activeFilter={activeFilter} 
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setSelectedIds([]); 
          }} 
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Scanning...</Text>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 5 }}>
          <FlashList<SortedImage>
            data={photos}
            keyExtractor={(item) => item.id}
            numColumns={3}
            {...({ estimatedItemSize: 120 } as any)} 
            extraData={selectedIds}
            renderItem={({ item }) => (
              <ImageCard 
                photo={item} 
                isSelected={selectedIds.includes(item.id)}
                onToggle={toggleSelection}
              />
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}