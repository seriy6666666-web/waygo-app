import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';
import { hapticSelection } from '../../utils/haptics';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}

export function Chip({ label, selected, onPress, emoji }: ChipProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  const emojiScale = useSharedValue(1);

  const handlePress = () => {
    hapticSelection();
    onPress?.();
  };

  useEffect(() => {
    if (selected) {
      emojiScale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
    }
  }, [selected]);

  const emojiAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (selected) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: true }}>
        <LinearGradient
          colors={[colors.accent, colors.accentBright]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.chip,
            Platform.OS === 'ios' && {
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
          ]}
        >
          {emoji && <Animated.View style={emojiAnimStyle}><Text style={styles.emoji}>{emoji}</Text></Animated.View>}
          <Text style={[styles.label, { color: colors.textInverse }]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
          borderColor: isNight ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
          borderWidth: 1,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: false }}
    >
      {emoji && <Animated.View style={emojiAnimStyle}><Text style={styles.emoji}>{emoji}</Text></Animated.View>}
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    gap: 6,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: typography.size.chip,
    fontFamily: typography.family.medium,
  },
});
