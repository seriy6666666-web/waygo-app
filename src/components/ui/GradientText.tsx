import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';

interface GradientTextProps {
  children: string | number;
  style?: TextStyle;
}

/**
 * Applies accent color to text. On iOS/Android we use the accent directly
 * for a vibrant look since MaskedView+SVG would be heavy.
 * The gradient feel comes from the environment (gradient cards behind).
 */
export function GradientText({ children, style }: GradientTextProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <Text style={[{ color: colors.accent }, style]}>
      {children}
    </Text>
  );
}
