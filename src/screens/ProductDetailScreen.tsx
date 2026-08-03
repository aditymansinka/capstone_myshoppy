import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import SimpleImage from '../components/SimpleImage';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onBack }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <SimpleImage uri={product.image} style={styles.image} resizeMode="contain" />

      <View style={styles.detailsCard}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.rating}>★ {product.rating} ({product.reviewsCount} reviews)</Text>

        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.stock}>
          Status: {product.isAvailable ? `In Stock (${product.stock} items left)` : 'Out of Stock'}
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            addToCart(product);
            onBack();
          }}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F8',
    padding: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: '#527576',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A2E2B',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D514C',
    marginVertical: 6,
  },
  rating: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  stock: {
    marginTop: 12,
    fontSize: 13,
    color: '#888',
  },
  cartButton: {
    backgroundColor: '#507677',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});