import React, { useState } from 'react';
import { Image, ImageProps, ImageStyle, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  style?: ImageStyle | ImageStyle[];
}

function SimpleImage({ uri, style, ...rest }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !uri) {
    return (
      <View style={[styles.fallback, style as any]}>
        <Ionicons name="image-outline" size={36} color="#9AA4A3" />
      </View>
    );
  }

  return (
    <Image
      {...rest}
      source={{ uri }}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#F0F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SimpleImage;
