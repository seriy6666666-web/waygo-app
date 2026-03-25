import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius } from '../../theme/tokens';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 8 }: ProgressBarProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        },
      ]}
    >
      <View
        style={[
          styles.fillWrap,
          {
            width: `${clampedProgress * 100}%`,
            height,
          },
        ]}
      >
        {color ? (
          <View style={[styles.fill, { backgroundColor: color, height }]} />
        ) : (
          <LinearGradient
            colors={[colors.accent, colors.accentBright]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { height }]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fillWrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: radius.pill,
  },
});
