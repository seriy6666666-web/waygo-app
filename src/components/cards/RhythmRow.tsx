import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';
import { WeekBar } from '../ui/WeekBar';

interface RhythmRowProps {
  streakDays: number;
  currentGoal: number;
  targetGoal: number;
  weekDays: ('full' | 'half' | 'empty')[];
}

export function RhythmRow({ streakDays, currentGoal, targetGoal, weekDays }: RhythmRowProps) {
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);
  const progress = targetGoal > 0 ? currentGoal / targetGoal : 0;

  return (
    <GlassCard>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.accentRhythm + '20' }]}>
          <Ionicons name="flame" size={18} color={colors.accentRhythm} />
        </View>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
          {t('home.rhythm.label') || 'Ритм'}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.streak, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
          {t('home.rhythm.streak', { count: streakDays })}
        </Text>
        <Text style={[styles.goal, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
          {t('home.rhythm.goal', { current: currentGoal, target: targetGoal })}
        </Text>
      </View>
      <View style={styles.weekRow}>
        <WeekBar days={weekDays} />
      </View>
      <ProgressBar progress={progress} />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.size.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  streak: {
    fontSize: typography.size.body,
  },
  goal: {
    fontSize: typography.size.body,
  },
  weekRow: {
    marginBottom: spacing.sm,
  },
});
