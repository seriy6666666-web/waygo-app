import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';

interface MoveCardProps {
  hasWalkToday: boolean;
  durationMin?: number;
  distanceKm?: number;
  onStartWalk: () => void;
}

export function MoveCard({ hasWalkToday, durationMin, distanceKm, onStartWalk }: MoveCardProps) {
  const colors = useThemeStore((s) => s.colors);
  const { t } = useTranslation();

  return (
    <GlassCard>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: colors.accent + '18' }]}>
          <Ionicons name="footsteps" size={18} color={colors.accent} />
        </View>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
          {t('home.moveCard.label') || 'Движение'}
        </Text>
      </View>
      {hasWalkToday ? (
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {durationMin}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              мин
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.stroke }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {distanceKm?.toFixed(1)}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              км
            </Text>
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.prompt, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>
            {t('home.moveCard.before')}
          </Text>
          <Button title={t('walk.start')} onPress={onStartWalk} style={styles.btn} />
        </>
      )}
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
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 32,
  },
  statUnit: {
    fontSize: typography.size.caption,
  },
  statDivider: {
    width: 1,
    height: 28,
    opacity: 0.3,
  },
  prompt: {
    fontSize: typography.size.h3,
    marginBottom: spacing.md,
  },
  btn: {
    alignSelf: 'flex-start',
  },
});
