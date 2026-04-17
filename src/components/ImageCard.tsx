// src/components/ImageCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Image source={{ uri: photo.uri }} style={styles.image} />
      
      {/* Visual indicator for selection */}
      {isSelected && (
        <View style={styles.checkOverlay}>
          <Text style={styles.checkText}>✓</Text>
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
    borderColor: 'transparent', // Invisible border by default
  },
  selectedCard: {
    borderColor: '#007AFF', // Blue border when selected
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontWeight: 'bold',
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