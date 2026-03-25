import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';
import { hapticLight } from '../../utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  const handlePress = () => {
    hapticLight();
    onPress();
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[colors.accent, colors.accentBright]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.primaryBtn,
            Platform.OS === 'ios' && {
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
            },
          ]}
        >
          <Text style={[styles.text, { color: colors.textInverse }]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const containerStyle: ViewStyle[] = [
    styles.base,
    variant === 'secondary' && {
      backgroundColor: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
      borderWidth: 1,
      borderColor: isNight ? 'rgba(255,255,255,0.12)' : colors.stroke,
    },
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.text,
    variant === 'secondary' && { color: colors.textPrimary },
    variant === 'ghost' && { color: colors.textSecondary },
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.size.body,
    fontFamily: typography.family.semibold,
  },
});
