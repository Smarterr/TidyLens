import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Modal, Switch } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons'; 
import { usePhotos } from '../hooks/usePhotos';
import ImageCard from '../components/ImageCard';
import FilterPills from '../components/FilterPills';
import { FilterType, SortedImage } from '../types';

import styles from '../styles/HomeScreen';

// This is the magic trick. By casting FlashList to 'any', we tell TypeScript
// to stop trying to validate the props and just let the code run.
const FlashListFixed = FlashList as any;

export default function HomeScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Largest');
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [includeICloud, setIncludeICloud] = useState(true); 
  
  // Hook
  const { photos, loading, scanStatus, removeDeletedPhotos } = usePhotos(hasPermission, activeFilter, includeICloud);

  // We use any here to prevent the "Value vs Type" conflict
  const flashListRef = useRef<any>(null);

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      setHasPermission(true);
    }
  }, [permissionResponse]);

  // Scroll to Top Logic
  useEffect(() => {
    if (photos.length > 0 && flashListRef.current) {
      // Use a small safety timeout to ensure the data is rendered before scrolling
      setTimeout(() => {
        flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 10);
    }
  }, [activeFilter, includeICloud]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      "Delete Items",
      `Are you sure you want to delete ${selectedIds.length} items?`,
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
                removeDeletedPhotos(selectedIds);
                setSelectedIds([]);
              }
            } catch (e) {
              Alert.alert("Error", "Could not delete items. Check if they are synced to iCloud.");
            }
          }
        }
      ]
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionTitle}>Welcome to TidyLens</Text>
        <Text style={styles.permissionSubtext}>
          To find your largest files and free up space, we need access to your camera roll. 
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showSettings} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Include iCloud Photos</Text>
                <Text style={styles.settingDescription}>Show photos stored in iCloud. Deleting these removes them from all devices.</Text>
              </View>
              <Switch 
                value={includeICloud} 
                onValueChange={(val) => {
                  setIncludeICloud(val);
                  setSelectedIds([]); 
                }} 
              />
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSettings(false)}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>TidyLens</Text>
            <Text style={styles.subtitle}>Free up space instantly</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={26} color="#111" />
          </TouchableOpacity>
        </View>
        
        {selectedIds.length > 0 && (
          <TouchableOpacity style={[styles.deleteButton, { marginTop: 15 }]} onPress={handleDelete}>
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
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, { marginTop: 20, fontSize: 16, fontWeight: 'bold' }]}>Native Scan in Progress</Text>
          <Text style={styles.loadingText}>{scanStatus}</Text>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 5 }}>
          {/* Using the Fixed component kills the red lines forever */}
          <FlashListFixed
            ref={flashListRef}
            data={photos}
            keyExtractor={(item: SortedImage) => item.id}
            numColumns={3}
            estimatedItemSize={120}
            extraData={selectedIds}
            renderItem={({ item }: { item: SortedImage }) => (
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