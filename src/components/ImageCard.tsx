// src/components/ImageCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons'; // <-- Brought in the icons!
import { SortedImage } from '../types';

interface ImageCardProps {
  photo: SortedImage;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export default function ImageCard({ photo, isSelected, onToggle }: ImageCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={() => onToggle(photo.id)}
      activeOpacity={0.8}
    >
      <Image source={photo.uri} style={styles.image} contentFit="cover" />
      
      {isSelected && (
        <View style={styles.checkOverlay}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}

      {/* THE NEW CLOUD ICON */}
      {photo.isICloud && (
        <View style={styles.cloudIcon}>
          <Ionicons name="cloud" size={14} color="white" />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.sizeText}>{photo.fileSizeMB} MB</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    aspectRatio: 1, 
    borderWidth: 3,
    borderColor: 'transparent', 
  },
  selectedCard: {
    borderColor: '#007AFF', 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    top: 5,
    left: 5, // Moved to left so it doesn't overlap the cloud icon
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cloudIcon: {
    position: 'absolute',
    bottom: 25, // Just above the dark info bar
    right: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
    alignItems: 'center',
  },
  sizeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});