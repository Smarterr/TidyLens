// src/components/ImageCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image'; // <--- The magic fix
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
      {/* expo-image automatically handles Apple's ph:// URIs */}
      <Image source={photo.uri} style={styles.image} contentFit="cover" />
      
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