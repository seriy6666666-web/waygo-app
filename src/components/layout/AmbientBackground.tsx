import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';

const { width, height } = Dimensions.get('window');

export function AmbientBackground() {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);

  const gradients = {
    morning: {
      colors: ['#FFF8F0', '#FFEDD5', '#FEF3C7', '#FFF8F0'] as const,
      locations: [0, 0.3, 0.7, 1] as const,
    },
    day: {
      colors: ['#F0FAF7', '#E0F5EE', '#D1F0E5', '#F0FAF7'] as const,
      locations: [0, 0.3, 0.7, 1] as const,
    },
    evening: {
      colors: ['#FFF5F5', '#FFE4E6', '#FED7D7', '#FFF0F3'] as const,
      locations: [0, 0.3, 0.7, 1] as const,
    },
    night: {
      colors: ['#0C0B14', '#0F0D1A', '#110E22', '#0C0B14'] as const,
      locations: [0, 0.3, 0.7, 1] as const,
    },
  };

  const g = gradients[timeBucket];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={g.colors}
        locations={g.locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft radial glow at top */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: colors.accent,
            opacity: timeBucket === 'night' ? 0.06 : 0.08,
          },
        ]}
      />
      {/* Secondary glow bottom-right */}
      <View
        style={[
          styles.glowSecondary,
          {
            backgroundColor: colors.accentBright,
            opacity: timeBucket === 'night' ? 0.04 : 0.06,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: -height * 0.15,
    left: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
  },
  glowSecondary: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.15,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
  },
});
