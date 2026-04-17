// src/components/FilterPills.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FilterType } from '../types';

interface FilterPillsProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

const FILTERS: FilterType[] = ['Largest', 'Videos', 'Screenshots', 'Oldest'];

export default function FilterPills({ activeFilter, onSelectFilter }: FilterPillsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.pill, activeFilter === filter && styles.activePill]}
          onPress={() => onSelectFilter(filter)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, activeFilter === filter && styles.activeText]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10, // Adds space between the pills
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activePill: {
    backgroundColor: '#000', // Sleek black for active state
    borderColor: '#000',
  },
  text: {
    fontWeight: '600',
    color: '#555',
  },
  activeText: {
    color: '#fff',
  },
});