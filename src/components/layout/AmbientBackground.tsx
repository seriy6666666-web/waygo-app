import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
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
  const isNight = timeBucket === 'night';

  // Animated glow drift
  const translateX1 = useSharedValue(0);
  const translateY1 = useSharedValue(0);
  const translateX2 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const scale3 = useSharedValue(1);

  useEffect(() => {
    const dur = 8000;
    const easing = Easing.inOut(Easing.sin);

    translateX1.value = withRepeat(
      withSequence(
        withTiming(width * 0.08, { duration: dur, easing }),
        withTiming(-width * 0.06, { duration: dur, easing }),
      ),
      -1,
      true,
    );
    translateY1.value = withRepeat(
      withSequence(
        withTiming(-height * 0.04, { duration: dur * 1.2, easing }),
        withTiming(height * 0.05, { duration: dur * 1.2, easing }),
      ),
      -1,
      true,
    );
    translateX2.value = withRepeat(
      withSequence(
        withTiming(-width * 0.06, { duration: dur * 0.9, easing }),
        withTiming(width * 0.08, { duration: dur * 0.9, easing }),
      ),
      -1,
      true,
    );
    translateY2.value = withRepeat(
      withSequence(
        withTiming(height * 0.05, { duration: dur * 1.1, easing }),
        withTiming(-height * 0.03, { duration: dur * 1.1, easing }),
      ),
      -1,
      true,
    );
    scale3.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: dur * 1.5, easing }),
        withTiming(0.9, { duration: dur * 1.5, easing }),
      ),
      -1,
      true,
    );
  }, []);

  const glow1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX1.value },
      { translateY: translateY1.value },
    ],
  }));

  const glow2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX2.value },
      { translateY: translateY2.value },
    ],
  }));

  const glow3Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={g.colors}
        locations={g.locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Animated glow 1 — top-left, accent */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: colors.accent,
            opacity: isNight ? 0.08 : 0.12,
          },
          glow1Style,
        ]}
      />
      {/* Animated glow 2 — bottom-right, bright */}
      <Animated.View
        style={[
          styles.glowSecondary,
          {
            backgroundColor: colors.accentBright,
            opacity: isNight ? 0.06 : 0.10,
          },
          glow2Style,
        ]}
      />
      {/* Animated glow 3 — center, breathing */}
      <Animated.View
        style={[
          styles.glowCenter,
          {
            backgroundColor: colors.accent,
            opacity: isNight ? 0.04 : 0.06,
          },
          glow3Style,
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
  glowCenter: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.15,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
  },
});
