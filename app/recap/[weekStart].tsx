import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { Button } from '../../src/components/ui/Button';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useRecapStore } from '../../src/stores/useRecapStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';
import type { MoodKey } from '../../src/types';
import { MOOD_LABELS } from '../../src/types';

export default function RecapScreen() {
  const { weekStart } = useLocalSearchParams<{ weekStart: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const recaps = useRecapStore((s) => s.recaps);
  const isRu = i18n.language === 'ru';

  const recap = recaps.find((r) => r.weekStart === weekStart);

  const totalWalks = recap?.totalWalks ?? 0;
  const totalDistanceKm = (recap?.totalDistanceM ?? 0) / 1000;
  const streakDays = recap?.streakDays ?? 0;
  const moodSummary = recap?.moodSummary ?? {};

  const topMoods = Object.entries(moodSummary)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 5);

  return (
    <SafeArea>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceCardAlt }]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={isRu ? 'Назад' : 'Go back'}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
          {t('recap.title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week range hero */}
        <AnimatedCard index={0}>
          <GlassCard intensity="strong">
            <Text style={[styles.heroEmoji]}>📊</Text>
            <Text style={[styles.heroTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {t('recap.title')}
            </Text>
            <Text style={[styles.weekRange, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {weekStart} — {recap?.weekEnd ?? '...'}
            </Text>
          </GlassCard>
        </AnimatedCard>

        {/* Stats grid */}
        <AnimatedCard index={1}>
          <GlassCard>
            <View style={styles.statsGrid}>
              <View style={styles.statBlock}>
                <View style={[styles.statIconBadge, { backgroundColor: colors.accent + '18' }]}>
                  <Ionicons name="footsteps" size={20} color={colors.accent} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                  {totalWalks}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                  {isRu ? 'прогулок' : 'walks'}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <View style={[styles.statIconBadge, { backgroundColor: colors.accentRhythm + '20' }]}>
                  <Ionicons name="navigate" size={20} color={colors.accentRhythm} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                  {totalDistanceKm.toFixed(1)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                  {isRu ? 'км' : 'km'}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <View style={[styles.statIconBadge, { backgroundColor: colors.accentMood + '20' }]}>
                  <Ionicons name="flame" size={20} color={colors.accentMood} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                  {streakDays}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                  {isRu ? 'дней серия' : 'day streak'}
                </Text>
              </View>
            </View>
          </GlassCard>
        </AnimatedCard>

        {/* Mood rhythm */}
        <AnimatedCard index={2}>
          <GlassCard>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accentMood + '20' }]}>
                <Ionicons name="happy" size={18} color={colors.accentMood} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
                {isRu ? 'РИТМ НАСТРОЕНИЯ' : 'MOOD RHYTHM'}
              </Text>
            </View>
            {topMoods.length > 0 ? (
              <View style={styles.moodChips}>
                {topMoods.map(([mood, count]) => {
                  const label = MOOD_LABELS[mood as MoodKey];
                  return (
                    <View key={mood} style={[styles.moodChip, { backgroundColor: colors.accent + '12' }]}>
                      <Text style={styles.moodEmoji}>{label?.emoji ?? '🫥'}</Text>
                      <Text style={[styles.moodChipText, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>
                        {isRu ? label?.ru : label?.en} × {count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu ? 'Нет данных о настроении' : 'No mood data'}
              </Text>
            )}
          </GlassCard>
        </AnimatedCard>

        {/* Highlight note */}
        {recap?.highlightNote ? (
          <AnimatedCard index={3}>
            <GlassCard intensity="soft">
              <View style={styles.noteRow}>
                <Ionicons name="sparkles" size={18} color={colors.accent} />
                <Text style={[styles.noteText, { color: colors.textPrimary, fontFamily: typography.family.regular }]}>
                  «{recap.highlightNote}»
                </Text>
              </View>
            </GlassCard>
          </AnimatedCard>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <Button title={t('common.back')} onPress={() => router.back()} variant="ghost" />
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.size.h3,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: typography.size.h1,
    textAlign: 'center',
  },
  weekRange: {
    fontSize: typography.size.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBlock: {
    alignItems: 'center',
    gap: 6,
  },
  statIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: typography.size.caption,
  },
  sectionHeader: {
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
  sectionTitle: {
    fontSize: typography.size.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  moodChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 999,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodChipText: {
    fontSize: typography.size.caption,
  },
  emptyText: {
    fontSize: typography.size.body,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  noteText: {
    fontSize: typography.size.body,
    flex: 1,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
