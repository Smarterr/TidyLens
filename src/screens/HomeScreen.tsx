import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import * as MediaLibrary from 'expo-media-library';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons'; 
import { usePhotos } from '../hooks/usePhotos';
import ImageCard from '../components/ImageCard';
import { FilterType, SortedImage } from '../types';

import styles from '../styles/HomeScreen';

const FlashListFixed = FlashList as any;

export default function HomeScreen() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Largest');
  
  const [viewMode, setViewMode] = useState<'dashboard' | 'grid'>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [includeICloud, setIncludeICloud] = useState(true); 
  
  const { photos, stats, loading, scanStatus, removeDeletedPhotos } = usePhotos(hasPermission, activeFilter, includeICloud);

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      setHasPermission(true);
    }
  }, [permissionResponse]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleCategoryPress = (filter: FilterType) => {
    setActiveFilter(filter);
    setSelectedIds([]);
    setViewMode('grid');
  };

  const handleSmartSelect = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
      return;
    }

    const idsToSelect: string[] = [];
    const groups: Record<string, SortedImage[]> = {};

    photos.forEach(photo => {
      if (photo.similarGroupId) {
        if (!groups[photo.similarGroupId]) groups[photo.similarGroupId] = [];
        groups[photo.similarGroupId].push(photo);
      }
    });

    Object.values(groups).forEach(group => {
      if (group.length > 1) {
        const sortedGroup = [...group].sort((a, b) => b.fileSizeMB - a.fileSizeMB);
        for (let i = 1; i < sortedGroup.length; i++) {
          idsToSelect.push(sortedGroup[i].id);
        }
      }
    });

    setSelectedIds(idsToSelect);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      "Delete Items",
      `Are you sure you want to delete ${selectedIds.length} items permanently?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const success = await MediaLibrary.deleteAssetsAsync(selectedIds);
              if (success) {
                removeDeletedPhotos(selectedIds);
                setSelectedIds([]);
                if (selectedIds.length === photos.length) {
                  setViewMode('dashboard');
                }
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
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="images" size={64} color="#007AFF" style={{ marginBottom: 20 }} />
          <Text style={styles.permissionTitle}>Welcome to TidyLens</Text>
          <Text style={styles.permissionSubtext}>To find your largest files and free up space, we need access to your camera roll.</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Modal visible={showSettings} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preferences</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Include iCloud</Text>
                <Text style={styles.settingDescription}>Scan photos stored in the cloud. Deleting these removes them from all Apple devices.</Text>
              </View>
              <Switch value={includeICloud} onValueChange={(val) => { setIncludeICloud(val); setSelectedIds([]); }} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSettings(false)}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            {viewMode === 'grid' && (
              <TouchableOpacity style={styles.backButton} onPress={() => { setViewMode('dashboard'); setSelectedIds([]); }}>
                <Ionicons name="chevron-back" size={28} color="#007AFF" />
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.title}>{viewMode === 'dashboard' ? 'TidyLens' : activeFilter}</Text>
              <Text style={styles.subtitle}>{viewMode === 'dashboard' ? 'Free up space instantly' : `${photos.length} items found`}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
            <Ionicons name="options" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, { marginTop: 20, fontSize: 16, fontWeight: '600', color: '#000' }]}>Analyzing Storage...</Text>
          <Text style={styles.loadingText}>{scanStatus}</Text>
        </View>
      ) : viewMode === 'dashboard' ? (
        
        <View style={styles.dashboardContainer}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Total Potential Savings</Text>
            <Text style={styles.heroValue}>{stats.totalSize} GB</Text>
            
            {includeICloud && (
              <View style={{ flexDirection: 'row', marginTop: 15, backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 14, width: '100%', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500', opacity: 0.9 }}>Device Storage</Text>
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 2 }}>{stats.localSize} GB</Text>
                </View>
                <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.3)', height: '100%' }} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '500', opacity: 0.9 }}>iCloud Storage</Text>
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 2 }}>{stats.icloudSize} GB</Text>
                </View>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Clean Up</Text>
          
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Similar')}>
            <View style={[styles.categoryIconBox, { backgroundColor: '#FFF0E5' }]}>
              <Ionicons name="copy" size={24} color="#FF9500" />
            </View>
            <View style={styles.categoryTextContent}>
              <Text style={styles.categoryTitle}>Similar Photos</Text>
              <Text style={styles.categorySubtext}>{stats.similar.count} items in bursts</Text>
            </View>
            <Text style={styles.categorySize}>{stats.similar.size}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          {/* NEW: Blurry Photos Card */}
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Blurry')}>
            <View style={[styles.categoryIconBox, { backgroundColor: '#E5FFF0' }]}>
              <Ionicons name="aperture" size={24} color="#34C759" /> 
            </View>
            <View style={styles.categoryTextContent}>
              <Text style={styles.categoryTitle}>Blurry & Low Quality</Text>
              <Text style={styles.categorySubtext}>{stats.blurry.count} items</Text>
            </View>
            <Text style={styles.categorySize}>{stats.blurry.size}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Videos')}>
            <View style={[styles.categoryIconBox, { backgroundColor: '#E5F0FF' }]}>
              <Ionicons name="videocam" size={24} color="#007AFF" />
            </View>
            <View style={styles.categoryTextContent}>
              <Text style={styles.categoryTitle}>Large Videos</Text>
              <Text style={styles.categorySubtext}>{stats.videos.count} items</Text>
            </View>
            <Text style={styles.categorySize}>{stats.videos.size}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Screenshots')}>
            <View style={[styles.categoryIconBox, { backgroundColor: '#F0E5FF' }]}>
              <Ionicons name="scan" size={24} color="#AF52DE" />
            </View>
            <View style={styles.categoryTextContent}>
              <Text style={styles.categoryTitle}>Screenshots</Text>
              <Text style={styles.categorySubtext}>{stats.screenshots.count} items</Text>
            </View>
            <Text style={styles.categorySize}>{stats.screenshots.size}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress('Largest')}>
            <View style={[styles.categoryIconBox, { backgroundColor: '#FFE5E5' }]}>
              <Ionicons name="images" size={24} color="#FF3B30" />
            </View>
            <View style={styles.categoryTextContent}>
              <Text style={styles.categoryTitle}>All Media</Text>
              <Text style={styles.categorySubtext}>{stats.largest.count} items</Text>
            </View>
            <Text style={styles.categorySize}>{stats.largest.size}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

      ) : (

        <View style={{ flex: 1 }}>
          {/* Dynamic Top Bar for Selection Buttons */}
          {(activeFilter === 'Screenshots' || activeFilter === 'Similar' || activeFilter === 'Blurry') && photos.length > 0 && (
            <View style={{ paddingHorizontal: 15, paddingBottom: 10, paddingTop: 5, alignItems: 'flex-end' }}>
              
              {/* Select All for Screenshots AND Blurry */}
              {(activeFilter === 'Screenshots' || activeFilter === 'Blurry') && (
                <TouchableOpacity onPress={() => setSelectedIds(selectedIds.length === photos.length ? [] : photos.map(p => p.id))}>
                  <Text style={styles.selectAllText}>
                    {selectedIds.length === photos.length ? 'Deselect All' : `Select All (${photos.length})`}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Smart Select specifically for Similar Photos */}
              {activeFilter === 'Similar' && (
                <TouchableOpacity onPress={handleSmartSelect}>
                  <Text style={styles.selectAllText}>
                    {selectedIds.length > 0 ? 'Deselect All' : '✨ Smart Select Duplicates'}
                  </Text>
                </TouchableOpacity>
              )}

            </View>
          )}

          <FlashListFixed
            key={activeFilter + includeICloud.toString()}
            data={photos}
            keyExtractor={(item: SortedImage) => item.id}
            numColumns={3}
            estimatedItemSize={120}
            extraData={selectedIds}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 2 }} 
            renderItem={({ item }: { item: SortedImage }) => (
              <ImageCard photo={item} isSelected={selectedIds.includes(item.id)} onToggle={toggleSelection} />
            )}
          />
        </View>
      )}

      {selectedIds.length > 0 && (
        <View style={styles.floatingDeleteContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={22} color="#FFF" />
            <Text style={styles.deleteButtonText}>Delete {selectedIds.length} items</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}