import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
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

  // Streak fire animation: pulse + subtle rotation
  const fireScale = useSharedValue(1);
  const fireRotate = useSharedValue(0);

  useEffect(() => {
    if (streakDays > 0) {
      fireScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      );
      fireRotate.value = withRepeat(
        withSequence(
          withTiming(3, { duration: 400 }),
          withTiming(-3, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
        true,
      );
    }
  }, [streakDays]);

  const fireAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fireScale.value },
      { rotate: `${fireRotate.value}deg` },
    ],
  }));

  return (
    <GlassCard>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.accentRhythm + '30', colors.accentRhythm + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBadge}
        >
          <Animated.View style={streakDays > 0 ? fireAnimStyle : undefined}>
            <Ionicons name="flame" size={18} color={colors.accentRhythm} />
          </Animated.View>
        </LinearGradient>
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
    width: 40,
    height: 40,
    borderRadius: 14,
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
