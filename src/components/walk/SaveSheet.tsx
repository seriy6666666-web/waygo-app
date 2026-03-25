import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const isNight = useThemeStore((s) => s.timeBucket) === 'night';

  return (
    <View style={styles.overlay}>
      <BlurView intensity={40} tint={isNight ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bgPrimary + '99' }]} />
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
          onPress={onSave}
          activeOpacity={0.8}
          style={styles.saveBtnWrap}
          accessibilityRole="button"
          accessibilityLabel={isRu ? 'Сохранить момент' : 'Save moment'}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentBright]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.saveBtn,
              Platform.OS === 'ios' && {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 14,
              },
            ]}
          >
            <Text style={[styles.saveBtnText, { color: colors.textInverse, fontFamily: typography.family.semibold }]}>
              {isRu ? 'Сохранить момент' : 'Save moment'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDiscard} style={styles.discardBtn} accessibilityRole="button" accessibilityLabel={isRu ? 'Пропустить' : 'Skip'}>
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
    overflow: 'hidden',
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
    fontSize: 22,
  },
  statUnit: {
    fontSize: typography.size.caption,
  },
  saveBtnWrap: {
    marginBottom: spacing.sm,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
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
