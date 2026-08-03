import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import SimpleImage from '../components/SimpleImage';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

interface ProductListScreenProps {
  category: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ category, products, onSelectProduct }) => {
  const { addToCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'lowToHigh' | 'highToLow'>('none');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const minimum = Number(minPrice);
    const maximum = Number(maxPrice);
    const hasMinimum = minPrice.trim() !== '' && !Number.isNaN(minimum);
    const hasMaximum = maxPrice.trim() !== '' && !Number.isNaN(maximum);

    const productsInCategory = products.filter((product) => {
      const matchesCategory = product.category === category;
      const matchesName = product.name.toLowerCase().includes(normalizedQuery);
      const meetsMinimum = !hasMinimum || product.price >= minimum;
      const meetsMaximum = !hasMaximum || product.price <= maximum;

      return matchesCategory && matchesName && meetsMinimum && meetsMaximum;
    });

    if (sortOrder === 'lowToHigh') {
      return [...productsInCategory].sort((first, second) => first.price - second.price);
    }
    if (sortOrder === 'highToLow') {
      return [...productsInCategory].sort((first, second) => second.price - first.price);
    }
    return productsInCategory;
  }, [category, maxPrice, minPrice, products, searchQuery, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('none');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.breadcrumb}>Categories/ {category}</Text>
            <Text style={styles.heading}>{category} For You!</Text>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search products by name"
              placeholderTextColor="#788886"
              style={styles.searchInput}
              autoCorrect={false}
            />

            <View style={styles.filterHeader}>
              <Text style={styles.filterLabel}>Price range</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFilters}>Clear filters</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.priceInputs}>
              <TextInput
                value={minPrice}
                onChangeText={setMinPrice}
                placeholder="Min price"
                placeholderTextColor="#788886"
                keyboardType="decimal-pad"
                style={styles.priceInput}
              />
              <Text style={styles.priceSeparator}>–</Text>
              <TextInput
                value={maxPrice}
                onChangeText={setMaxPrice}
                placeholder="Max price"
                placeholderTextColor="#788886"
                keyboardType="decimal-pad"
                style={styles.priceInput}
              />
            </View>

            <Text style={styles.filterLabel}>Sort by price</Text>
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[styles.sortButton, sortOrder === 'lowToHigh' && styles.sortButtonActive]}
                onPress={() => setSortOrder('lowToHigh')}
              >
                <Text style={[styles.sortButtonText, sortOrder === 'lowToHigh' && styles.sortButtonTextActive]}>Low to high</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortOrder === 'highToLow' && styles.sortButtonActive]}
                onPress={() => setSortOrder('highToLow')}
              >
                <Text style={[styles.sortButtonText, sortOrder === 'highToLow' && styles.sortButtonTextActive]}>High to low</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.resultCount}>{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} found</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No products match these filters.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onSelectProduct(item)}
          >
            <TouchableOpacity style={styles.heartIcon}>
              <Ionicons name="heart-outline" size={18} color="#666" />
            </TouchableOpacity>

            <SimpleImage uri={item.image} style={styles.productImage} resizeMode="cover" />

            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>

              <Text style={styles.description} numberOfLines={1}>
                {item.description}
              </Text>

              <View style={styles.ratingRow}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.reviews}>({item.reviewsCount})</Text>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
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
  breadcrumb: {
    fontSize: 18,
    fontWeight: '600',
    color: '#527576',
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2E2B',
    marginVertical: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E0DF',
    borderWidth: 1,
    borderRadius: 10,
    color: '#1A2E2B',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    color: '#1A2E2B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  clearFilters: {
    color: '#527576',
    fontSize: 12,
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#D7E0DF',
    borderWidth: 1,
    borderRadius: 10,
    color: '#1A2E2B',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  priceSeparator: {
    color: '#527576',
    fontSize: 18,
    marginHorizontal: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sortButton: {
    borderColor: '#527576',
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sortButtonActive: {
    backgroundColor: '#507677',
  },
  sortButtonText: {
    color: '#527576',
    fontSize: 12,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  resultCount: {
    color: '#667C7A',
    fontSize: 12,
    marginBottom: 14,
  },
  emptyText: {
    color: '#667C7A',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: 140,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#F0F3F3',
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A2E2B',
    flex: 1,
    marginRight: 2,
  },
  price: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A2E2B',
  },
  description: {
    fontSize: 9,
    color: '#888888',
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    color: '#2E7D32',
    fontSize: 10,
  },
  reviews: {
    fontSize: 8,
    color: '#888',
    marginLeft: 2,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#2D514C',
    borderRadius: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D514C',
  },
});
