import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.bannerCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Shopping And Department Store.</Text>
        <Text style={styles.subtitle}>
          Shopping is a bit of a relaxing hobby for me, which is sometimes troubling for the bank balance.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F8',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  bannerCard: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: 24,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A2E2B',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#667C7A',
    lineHeight: 20,
  },
});