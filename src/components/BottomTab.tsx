import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomTabProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomTab: React.FC<BottomTabProps> = ({ activeTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => onSelectTab('Home')}>
        <Ionicons
          name={activeTab === 'Home' ? 'home' : 'home-outline'}
          size={24}
          color="#FFFFFF"
        />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onSelectTab('Categories')}>
        <Ionicons
          name={activeTab === 'Categories' ? 'grid' : 'grid-outline'}
          size={24}
          color="#FFFFFF"
        />
        <Text style={styles.tabText}>Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onSelectTab('Cart')}>
        <Ionicons
          name={activeTab === 'Cart' ? 'cart' : 'cart-outline'}
          size={24}
          color="#FFFFFF"
        />
        <Text style={styles.tabText}>Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#507677',
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});