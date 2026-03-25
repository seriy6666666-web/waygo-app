import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius } from '../../theme/tokens';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = radius.md, style }: SkeletonProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 900 }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        },
        animStyle,
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isNight ? 'rgba(20,18,40,0.20)' : 'rgba(255,255,255,0.85)',
          borderColor: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
        },
        style,
      ]}
    >
      <Skeleton width="40%" height={14} />
      <View style={styles.spacer} />
      <Skeleton width="100%" height={42} borderRadius={radius.sm} />
      <View style={styles.spacer} />
      <Skeleton width="60%" height={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: 24,
    gap: 4,
  },
  spacer: {
    height: 8,
  },
});
