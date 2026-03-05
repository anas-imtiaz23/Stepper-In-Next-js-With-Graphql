import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'

const Category = ({ item, selectedCategory, setSelectedCategory }) => {
  // If this is a single category item component
  return (
    <TouchableOpacity 
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategory
      ]}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  )
}

export default Category

const styles = StyleSheet.create({
    categoryItem: {
        marginHorizontal: 8,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B45F7A',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#FFB6C1',
    },
    selectedCategory: {
        // Removed transform property that was causing movement
        // transform: [{ scale: 1.05 }],  // <-- This was causing the movement
    },
    selectedText: {
        backgroundColor: '#FF69B4',
        color: '#FFFFFF',
        borderColor: '#FF69B4',
    },
})