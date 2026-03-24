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
      soft: isNight ? 0.12 : 0.65,
      medium: isNight ? 0.18 : 0.82,
      strong: isNight ? 0.25 : 0.92,
    };

    const borderOpacity = isNight ? 0.18 : 0.5;
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
              shadowColor: isNight ? '#000' : '#64748B',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isNight ? 0.35 : 0.08,
              shadowRadius: 24,
            },
            android: { elevation: 4 },
            web: {
              boxShadow: isNight
                ? '0 8px 32px rgba(0,0,0,0.35)'
                : '0 8px 32px rgba(100,116,139,0.08)',
            } as any,
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.lg,
  },
});
