import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';
import { GlassCard } from '../ui/GlassCard';

interface SaveSheetProps {
  durationSec: number;
  distanceM: number;
  speedKmh: number;
  calories: number;
  steps: number;
  isRu: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function SaveSheet({ durationSec, distanceM, speedKmh, calories, steps, isRu, onSave, onDiscard }: SaveSheetProps) {
  const colors = useThemeStore((s) => s.colors);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const stats = [
    { icon: 'time-outline' as const, value: formatDuration(durationSec), unit: isRu ? 'мин' : 'min' },
    { icon: 'navigate-outline' as const, value: (distanceM / 1000).toFixed(1), unit: isRu ? 'км' : 'km' },
    { icon: 'speedometer-outline' as const, value: speedKmh.toFixed(1), unit: isRu ? 'км/ч' : 'km/h' },
    { icon: 'flame-outline' as const, value: Math.round(calories).toString(), unit: isRu ? 'ккал' : 'kcal' },
    { icon: 'footsteps-outline' as const, value: steps.toLocaleString(), unit: isRu ? 'шагов' : 'steps' },
  ];

  return (
    <View style={[styles.overlay, { backgroundColor: colors.bgPrimary + 'F0' }]}>
      <GlassCard intensity="strong" style={styles.sheet}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
          {isRu ? 'Сохранить маршрут?' : 'Save route?'}
        </Text>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.icon} style={styles.statCell}>
              <Ionicons name={s.icon} size={18} color={colors.accent} />
              <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                {s.value}
              </Text>
              <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {s.unit}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.accent }]}
          onPress={onSave}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveBtnText, { color: colors.textInverse, fontFamily: typography.family.semibold }]}>
            {isRu ? 'Сохранить момент' : 'Save moment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDiscard} style={styles.discardBtn}>
          <Text style={[styles.discardText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
            {isRu ? 'Пропустить' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheet: {
    borderRadius: radius.sheet,
  },
  title: {
    fontSize: typography.size.h2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCell: {
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  statValue: {
    fontSize: 20,
  },
  statUnit: {
    fontSize: typography.size.caption,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saveBtnText: {
    fontSize: typography.size.body,
  },
  discardBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  discardText: {
    fontSize: typography.size.body,
  },
});
