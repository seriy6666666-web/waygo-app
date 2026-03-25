import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';

interface ProgressRingProps {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function ProgressRing({ progress, size = 64, strokeWidth = 4, style, children }: ProgressRingProps) {
  const colors = useThemeStore((s) => s.colors);
  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withTiming(Math.min(progress, 1), { duration: 800 });
  }, [progress]);

  const innerSize = size - strokeWidth * 2;

  // We'll use a clip-based approach with two half-circles
  const animatedRightStyle = useAnimatedStyle(() => {
    const deg = animProgress.value <= 0.5
      ? animProgress.value * 360
      : 180;
    return {
      transform: [{ rotate: `${deg}deg` }],
    };
  });

  const animatedLeftStyle = useAnimatedStyle(() => {
    const deg = animProgress.value > 0.5
      ? (animProgress.value - 0.5) * 360
      : 0;
    return {
      transform: [{ rotate: `${deg}deg` }],
    };
  });

  const halfSize = size / 2;

  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* Background ring */}
      <View style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: halfSize,
          borderWidth: strokeWidth,
          borderColor: colors.accent + '20',
        },
      ]} />

      {/* Right half */}
      <View style={[styles.halfClip, { width: halfSize, height: size, left: halfSize, overflow: 'hidden' }]}>
        <Animated.View style={[
          styles.halfCircle,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
            borderColor: colors.accent,
            left: -halfSize,
          },
          animatedRightStyle,
        ]} />
      </View>

      {/* Left half */}
      <View style={[styles.halfClip, { width: halfSize, height: size, left: 0, overflow: 'hidden' }]}>
        <Animated.View style={[
          styles.halfCircle,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
            borderColor: colors.accent,
            left: 0,
          },
          animatedLeftStyle,
        ]} />
      </View>

      {/* Center content */}
      {children && (
        <View style={[styles.centerContent, { width: size, height: size }]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
  },
  halfClip: {
    position: 'absolute',
    top: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
