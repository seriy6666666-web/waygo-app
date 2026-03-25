import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { GlassCard } from '../src/components/ui/GlassCard';
import { useChallengeStore } from '../src/stores/useChallengeStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { spacing, typography } from '../src/theme/tokens';

export default function ChallengesScreen() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const isRu = i18n.language === 'ru';

  const challenges = useChallengeStore((s) => s.challenges);
  const generateWeeklyChallenges = useChallengeStore((s) => s.generateWeeklyChallenges);
  const refreshProgress = useChallengeStore((s) => s.refreshProgress);

  useEffect(() => {
    generateWeeklyChallenges();
  }, []);

  useEffect(() => {
    if (challenges.length > 0) {
      refreshProgress();
    }
  }, [challenges.length]);

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <SafeArea>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.surfaceCardAlt }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
          {isRu ? 'Челленджи' : 'Challenges'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary */}
        <GlassCard intensity="soft">
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 28 }}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryTitle, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                {isRu ? 'Еженедельные челленджи' : 'Weekly Challenges'}
              </Text>
              <Text style={[styles.summarySubtitle, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {completedCount}/{challenges.length} {isRu ? 'выполнено' : 'completed'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Challenge cards */}
        {challenges.map((ch) => {
          const progress = ch.target > 0 ? Math.min(ch.current / ch.target, 1) : 0;
          const displayCurrent = ch.type === 'walk_distance'
            ? (ch.current / 1000).toFixed(1)
            : ch.current;
          const displayTarget = ch.type === 'walk_distance'
            ? (ch.target / 1000).toFixed(0)
            : ch.target;
          const unit = ch.type === 'walk_distance'
            ? (isRu ? 'км' : 'km')
            : '';

          return (
            <GlassCard key={ch.id} intensity="medium">
              <View style={styles.challengeRow}>
                <Text style={{ fontSize: 28 }}>{ch.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.challengeTitle, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                    {isRu ? ch.titleRu : ch.titleEn}
                  </Text>
                  <Text style={[styles.challengeProgress, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    {displayCurrent} / {displayTarget} {unit}
                  </Text>

                  {/* Progress bar */}
                  <View style={styles.progressBg}>
                    {ch.completed ? (
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.round(progress * 100)}%`,
                            backgroundColor: '#34D399',
                          },
                        ]}
                      />
                    ) : (
                      <View style={[styles.progressFillWrap, { width: `${Math.round(progress * 100)}%` }]}>
                        <LinearGradient
                          colors={[colors.accent, colors.accentBright]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.progressFill}
                        />
                      </View>
                    )}
                  </View>
                </View>

                {ch.completed && (
                  <Ionicons name="checkmark-circle" size={24} color="#34D399" />
                )}
              </View>
            </GlassCard>
          );
        })}

        {challenges.length === 0 && (
          <GlassCard intensity="soft">
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {isRu ? 'Начните прогулку — челленджи появятся!' : 'Start a walk — challenges will appear!'}
            </Text>
          </GlassCard>
        )}
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
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.h3,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.size.body,
  },
  summarySubtitle: {
    fontSize: typography.size.caption,
    marginTop: 2,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  challengeTitle: {
    fontSize: typography.size.body,
  },
  challengeProgress: {
    fontSize: typography.size.caption,
    marginTop: 2,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    marginTop: spacing.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  progressFillWrap: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    flex: 1,
  },
  emptyText: {
    fontSize: typography.size.body,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
