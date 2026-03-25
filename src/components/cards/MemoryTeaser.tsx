import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import { GlassCard } from '../ui/GlassCard';

interface MemoryTeaserProps {
  date: string;
  mood?: string;
  note?: string;
  onPress: () => void;
}

export function MemoryTeaser({ date, mood, note, onPress }: MemoryTeaserProps) {
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`Memory ${date}`}>
      <GlassCard intensity="soft">
        <Text style={[styles.label, { color: colors.textSecondary }]}>🗂 Memory</Text>
        <Text style={[styles.date, { color: colors.textPrimary }]}>{date}</Text>
        {mood && <Text style={[styles.mood, { color: colors.accent }]}>{mood}</Text>}
        {note && <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={2}>{note}</Text>}
        <Text style={[styles.link, { color: colors.accent }]}>{t('home.memoryTeaser')} →</Text>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  date: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
    marginBottom: 4,
  },
  mood: {
    fontSize: typography.size.body,
    marginBottom: 4,
  },
  note: {
    fontSize: typography.size.caption,
    marginBottom: spacing.sm,
  },
  link: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
  },
});
