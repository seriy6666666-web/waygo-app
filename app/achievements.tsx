import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { AnimatedCard } from '../src/components/ui/AnimatedCard';
import { GlassCard } from '../src/components/ui/GlassCard';
import { ACHIEVEMENTS_CATALOG, TIER_CONFIG } from '../src/constants/achievements';
import { useAchievementStore } from '../src/stores/useAchievementStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { spacing, typography } from '../src/theme/tokens';
import type { Achievement } from '../src/types';

export default function AchievementsScreen() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const { unlocked, loading, loadUnlocked } = useAchievementStore();
  const isRu = i18n.language === 'ru';

  useEffect(() => {
    let mounted = true;
    loadUnlocked().finally(() => {
      if (!mounted) return;
    });
    return () => { mounted = false; };
  }, []);

  const unlockedSet = new Set(unlocked.map((u) => u.achievementId));
  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS_CATALOG.length;

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
          {isRu ? 'Достижения' : 'Achievements'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress hero */}
        <AnimatedCard index={0}>
          <GlassCard intensity="strong">
            <Text style={styles.heroEmoji}>🏆</Text>
            <Text style={[styles.heroCount, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {unlockedCount} / {totalCount}
            </Text>
            <Text style={[styles.heroLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {isRu ? 'достижений открыто' : 'achievements unlocked'}
            </Text>
          </GlassCard>
        </AnimatedCard>

        {/* Achievements list */}
        {ACHIEVEMENTS_CATALOG.map((ach, idx) => {
          const isUnlocked = unlockedSet.has(ach.id);
          return (
            <AnimatedCard key={ach.id} index={idx + 1}>
              <AchievementRow
                achievement={ach}
                isUnlocked={isUnlocked}
                isRu={isRu}
                colors={colors}
              />
            </AnimatedCard>
          );
        })}
      </ScrollView>
    </SafeArea>
  );
}

function AchievementRow({
  achievement,
  isUnlocked,
  isRu,
  colors,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  isRu: boolean;
  colors: ReturnType<typeof useThemeStore.getState>['colors'];
}) {
  const tier = TIER_CONFIG[achievement.tier] ?? TIER_CONFIG.bronze;
  const iconName = achievement.icon as keyof typeof Ionicons.glyphMap;

  return (
    <GlassCard intensity={isUnlocked ? 'medium' : 'soft'}>
      <View style={[styles.achRow, !isUnlocked && styles.achRowLocked]}>
        <View
          style={[
            styles.achIconBadge,
            {
              backgroundColor: isUnlocked ? tier.color + '25' : colors.surfaceCardAlt,
            },
          ]}
        >
          {isUnlocked ? (
            <Ionicons name={iconName} size={22} color={tier.color} />
          ) : (
            <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
          )}
        </View>
        <View style={styles.achInfo}>
          <View style={styles.achTitleRow}>
            <Text
              style={[
                styles.achTitle,
                {
                  color: isUnlocked ? colors.textPrimary : colors.textSecondary,
                  fontFamily: typography.family.semibold,
                },
              ]}
            >
              {isRu ? achievement.titleRu : achievement.titleEn}
            </Text>
            <Text style={styles.tierEmoji}>{tier.emoji}</Text>
          </View>
          <Text
            style={[
              styles.achDesc,
              {
                color: colors.textSecondary,
                fontFamily: typography.family.regular,
              },
            ]}
          >
            {isRu ? achievement.descriptionRu : achievement.descriptionEn}
          </Text>
          {achievement.premium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="star" size={10} color={colors.accent} />
              <Text style={[styles.premiumText, { color: colors.accent, fontFamily: typography.family.medium }]}>
                Premium
              </Text>
            </View>
          )}
        </View>
      </View>
    </GlassCard>
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
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  heroEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroCount: {
    fontSize: 32,
    textAlign: 'center',
  },
  heroLabel: {
    fontSize: typography.size.caption,
    textAlign: 'center',
    marginTop: 4,
  },
  achRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  achRowLocked: {
    opacity: 0.55,
  },
  achIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achInfo: {
    flex: 1,
    gap: 2,
  },
  achTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  achTitle: {
    fontSize: typography.size.body,
  },
  tierEmoji: {
    fontSize: 14,
  },
  achDesc: {
    fontSize: typography.size.caption,
    lineHeight: 18,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 4,
  },
  premiumText: {
    fontSize: 10,
  },
});
