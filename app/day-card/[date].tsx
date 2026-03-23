import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { Button } from '../../src/components/ui/Button';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { getMoodsByDate, getWalksByDate } from '../../src/services/database';
import { useDayStore } from '../../src/stores/useDayStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';
import type { MoodKey } from '../../src/types';
import { MOOD_LABELS } from '../../src/types';

let ViewShot: any = View;
let Sharing: any = null;
if (Platform.OS !== 'web') {
  ViewShot = require('react-native-view-shot').default;
  Sharing = require('expo-sharing');
}

export default function DayCardScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const recentCards = useDayStore((s) => s.recentCards);
  const isRu = i18n.language === 'ru';

  const dayCard = recentCards.find((c) => c.date === date);
  const viewShotRef = useRef<any>(null);

  const [walks, setWalks] = useState<any[]>([]);
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    if (date) {
      getWalksByDate(date).then(setWalks);
      getMoodsByDate(date).then(setMoods);
    }
  }, [date]);

  const handleShare = async () => {
    if (Platform.OS === 'web' || !Sharing) return;
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Waygo Day Card' });
      }
    } catch {}
  };

  const totalDistanceKm = walks.reduce((a: number, w: any) => a + (w.distance_m || 0), 0) / 1000;
  const totalDurationMin = walks.reduce((a: number, w: any) => a + (w.duration_sec || 0), 0) / 60;

  return (
    <SafeArea>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceCardAlt }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
          {date}
        </Text>
        <View style={{ width: 40 }}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surfaceCardAlt }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={{ backgroundColor: colors.bgPrimary, padding: spacing.md, borderRadius: 20 }}>
        {/* Date Hero */}
        <AnimatedCard index={0}>
          <GlassCard intensity="strong">
            <Text style={[styles.heroDate, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {date}
            </Text>
            {dayCard?.city && (
              <View style={styles.cityRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.cityText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                  {dayCard.city}
                </Text>
              </View>
            )}
          </GlassCard>
        </AnimatedCard>

        {/* Moods section */}
        <AnimatedCard index={1}>
          <GlassCard>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accentMood + '20' }]}>
                <Ionicons name="happy" size={18} color={colors.accentMood} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
                {isRu ? 'НАСТРОЕНИЕ' : 'MOOD'}
              </Text>
            </View>
            {moods.length > 0 ? (
              <View style={styles.moodList}>
                {moods.map((m: any, i: number) => {
                  const moodKey = m.mood as MoodKey;
                  const label = MOOD_LABELS[moodKey];
                  return (
                    <View key={i} style={styles.moodRow}>
                      <Text style={styles.moodEmoji}>{label?.emoji ?? '🫥'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moodLabel, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                          {isRu ? label?.ru : label?.en}
                        </Text>
                        {m.note && (
                          <Text style={[styles.moodNote, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                            «{m.note}»
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu ? 'Настроение не записано' : 'No mood logged'}
              </Text>
            )}
          </GlassCard>
        </AnimatedCard>

        {/* Walks section */}
        <AnimatedCard index={2}>
          <GlassCard>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accent + '18' }]}>
                <Ionicons name="footsteps" size={18} color={colors.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
                {isRu ? 'ДВИЖЕНИЕ' : 'MOVEMENT'}
              </Text>
            </View>
            {walks.length > 0 ? (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                    {totalDistanceKm.toFixed(1)}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    {isRu ? 'км' : 'km'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.stroke }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                    {Math.round(totalDurationMin)}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    {isRu ? 'мин' : 'min'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.stroke }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                    {walks.length}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    {isRu ? 'прог.' : 'walks'}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu ? 'Прогулок нет' : 'No walks'}
              </Text>
            )}
          </GlassCard>
        </AnimatedCard>

        {/* Tags */}
        {dayCard && dayCard.tags.length > 0 && (
          <AnimatedCard index={3}>
            <GlassCard>
              <View style={styles.tagRow}>
                {dayCard.tags.map((tag: string) => (
                  <View key={tag} style={[styles.tagChip, { backgroundColor: colors.accent + '18' }]}>
                    <Text style={[styles.tagText, { color: colors.accent, fontFamily: typography.family.medium }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </AnimatedCard>
        )}

        </ViewShot>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title={isRu ? 'Поделиться' : 'Share'} onPress={handleShare} />
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
  heroDate: {
    fontSize: typography.size.h1,
    textAlign: 'center',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  cityText: {
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
  moodList: {
    gap: spacing.sm,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: typography.size.body,
  },
  moodNote: {
    fontSize: typography.size.caption,
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyText: {
    fontSize: typography.size.body,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
  },
  statUnit: {
    fontSize: typography.size.caption,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.3,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: typography.size.chip,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
