import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}

export function Chip({ label, selected, onPress, emoji }: ChipProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: colors.surfaceCardAlt, borderColor: colors.stroke }, selected && { backgroundColor: colors.accent, borderColor: colors.accent }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, { color: colors.textPrimary }, selected && { color: colors.textInverse }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
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
