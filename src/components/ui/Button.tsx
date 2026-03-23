import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const colors = useThemeStore((s) => s.colors);

  const containerStyle: ViewStyle[] = [
    styles.base,
    variant === 'primary' && { backgroundColor: colors.accent },
    variant === 'secondary' && { backgroundColor: colors.surfaceCardAlt, borderWidth: 1, borderColor: colors.stroke },
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.text,
    variant === 'primary' && { color: colors.textInverse },
    variant === 'secondary' && { color: colors.textPrimary },
    variant === 'ghost' && { color: colors.textSecondary },
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
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
