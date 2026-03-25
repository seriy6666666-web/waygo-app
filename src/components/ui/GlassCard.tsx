import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing } from '../../theme/tokens';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'soft' | 'medium' | 'strong';
  noPadding?: boolean;
}

export function GlassCard({ children, style, intensity = 'medium', noPadding }: GlassCardProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  const opacityMap = {
    soft: isNight ? 0.14 : 0.68,
    medium: isNight ? 0.20 : 0.85,
    strong: isNight ? 0.28 : 0.94,
  };

  const borderOpacity = isNight ? 0.15 : 0.45;
  const innerGlowOpacity = isNight ? 0.06 : 0.10;

  return (
    <View
      style={[
        styles.card,
        !noPadding && styles.padded,
        {
          backgroundColor: isNight
            ? `rgba(20, 18, 40, ${opacityMap[intensity]})`
            : `rgba(255, 255, 255, ${opacityMap[intensity]})`,
          borderColor: isNight
            ? `rgba(255, 255, 255, ${borderOpacity})`
            : `rgba(255, 255, 255, ${borderOpacity})`,
          ...Platform.select({
            ios: {
              shadowColor: isNight ? '#000' : '#1A2030',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isNight ? 0.35 : 0.10,
              shadowRadius: 28,
            },
            android: { elevation: 8 },
            web: {
              boxShadow: isNight
                ? '0 10px 40px rgba(0,0,0,0.35)'
                : '0 10px 40px rgba(26,32,48,0.10)',
            } as any,
          }),
        },
        style,
      ]}
    >
      {/* Inner gradient glow — subtle accent tint */}
      <LinearGradient
        colors={[
          `${colors.accent}${isNight ? '0F' : '14'}`,
          'transparent',
          `${colors.accentBright}${isNight ? '08' : '0A'}`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.xl,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
