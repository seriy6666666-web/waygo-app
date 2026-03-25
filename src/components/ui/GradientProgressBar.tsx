import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius } from '../../theme/tokens';

interface GradientProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export function GradientProgressBar({ progress, height = 10 }: GradientProgressBarProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withSpring(clampedProgress, { damping: 20, stiffness: 90 });
  }, [clampedProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%` as any,
  }));

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
      <Animated.View style={[styles.fillContainer, { height }, fillStyle]}>
        <LinearGradient
          colors={[colors.accent, colors.accentBright]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { height }]}
        />
      </Animated.View>
      {/* Glow effect */}
      {Platform.OS === 'ios' && (
        <Animated.View
          style={[
            fillStyle,
            styles.glow,
            {
              height: height + 8,
              top: -4,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fillContainer: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: radius.pill,
  },
  glow: {
    position: 'absolute',
    left: 0,
    borderRadius: radius.pill,
  },
});
