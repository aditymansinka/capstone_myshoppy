import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBack = false, onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#5B7C7D" />
          </TouchableOpacity>
        ) : null}

        <Text style={styles.logoText}>MyShoppy</Text>

        <View style={styles.rightIcons}>
          <Ionicons name="battery-charging" size={20} color="#5B7C7D" style={styles.icon} />
          <Ionicons name="cellular-outline" size={20} color="#5B7C7D" style={styles.icon} />
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={24} color="#5B7C7D" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FAFDFD',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#466867',
    textDecorationLine: 'underline',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
});