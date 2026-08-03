import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, StatusBar, Text } from 'react-native';
import { CartProvider } from './src/context/CartContext';
import { Header } from './src/components/Header';
import { BottomTab } from './src/components/BottomTab';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { ProductListScreen } from './src/screens/ProductListScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { useProducts } from './src/hooks/useProducts';
import { Product } from './src/types';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { categories, products, loading, error } = useProducts();

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('Categories');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'Categories') {
      setSelectedCategory(null);
    }
    setSelectedProduct(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#507677" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (selectedProduct) {
      return <ProductDetailScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
    }

    if (activeTab === 'Home') {
      return <HomeScreen />;
    }

    if (activeTab === 'Categories') {
      if (selectedCategory) {
        return (
          <ProductListScreen
            category={selectedCategory}
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        );
      }
      return <CategoriesScreen categories={categories} onSelectCategory={handleSelectCategory} />;
    }

    if (activeTab === 'Cart') {
      return <CartScreen onContinueShopping={() => handleTabPress('Home')} />;
    }

    return <HomeScreen />;
  };

  return (
    <CartProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          showBack={
            (activeTab === 'Categories' && selectedCategory !== null) || activeTab === 'Cart'
          }
          onBack={() => {
            if (activeTab === 'Categories' && selectedCategory !== null) {
              setSelectedCategory(null);
              setActiveTab('Home');
              setSelectedProduct(null);
            } else if (activeTab === 'Cart') {
              setActiveTab('Categories');
            }
          }}
        />
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <View style={styles.body}>{renderContent()}</View>
        <BottomTab activeTab={activeTab} onSelectTab={handleTabPress} />
      </View>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFD',
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#507677',
    fontSize: 16,
  },
  errorBanner: {
    backgroundColor: '#FCE7E7',
    padding: 10,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
  },
});