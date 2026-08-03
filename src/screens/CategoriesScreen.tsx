import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import SimpleImage from '../components/SimpleImage';
import { Category } from '../api/productsApi';

interface CategoriesScreenProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ categories, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Categories</Text>
      {categories.length === 0 ? (
        <Text style={styles.emptyText}>No categories available yet. Please wait while data loads.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(item.name)}
            >
              <SimpleImage uri={item.image} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F8',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#527576',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingTop: 16,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});