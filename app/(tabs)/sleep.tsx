import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SleepChart } from '../../src/components/charts/SleepChart';
import { SleepTrendChart } from '../../src/components/charts/SleepTrendChart';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PulseView } from '../../src/components/ui/PulseView';
import { useSleepStore } from '../../src/stores/useSleepStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';
import { hapticLight } from '../../src/utils/haptics';

const QUALITY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  great: 'moon',
  ok: 'partly-sunny',
  meh: 'cloudy',
  bad: 'thunderstorm',
};

const QUALITY_COLOR: Record<string, string> = {
  great: '#34D399',
  ok: '#6FAEA5',
  meh: '#FBBF24',
  bad: '#EF4444',
};

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}ч ${m}м`;
}

function formatDurationEn(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export default function SleepScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const { entries, todayEntry } = useSleepStore();
  const weekAvg = useSleepStore.getState().getWeekAverage();

  const isRu = i18n.language === 'ru';
  const fmtDur = isRu ? formatDuration : formatDurationEn;

  return (
    <SafeArea>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('sleep.title')}</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
            onPress={() => { hapticLight(); router.push('/add-sleep'); }}
          >
            <Ionicons name="add" size={24} color={colors.textInverse} />
          </TouchableOpacity>
        </View>

        {/* Today card */}
        {todayEntry ? (
          <GlassCard style={styles.todayCard}>
            <Text style={[styles.todayLabel, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
              {isRu ? 'Сегодня' : 'Today'}
            </Text>
            <View style={styles.todayRow}>
              <View style={styles.todayStat}>
                <View style={[styles.qualityBadge, { backgroundColor: QUALITY_COLOR[todayEntry.quality] + '20' }]}>
                  <Ionicons name={QUALITY_ICON[todayEntry.quality] ?? 'moon'} size={24} color={QUALITY_COLOR[todayEntry.quality]} />
                </View>
                <Text style={[styles.todayQuality, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                  {t(`sleep.qualities.${todayEntry.quality}`)}
                </Text>
              </View>
              <View style={styles.todayStat}>
                <View style={[styles.timeBadge, { backgroundColor: colors.accent + '18' }]}>
                  <Ionicons name="moon-outline" size={20} color={colors.accent} />
                </View>
                <Text style={[styles.todayTime, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>{todayEntry.bedTime}</Text>
              </View>
              <View style={styles.todayStat}>
                <View style={[styles.timeBadge, { backgroundColor: '#FBBF24' + '18' }]}>
                  <Ionicons name="sunny-outline" size={20} color="#FBBF24" />
                </View>
                <Text style={[styles.todayTime, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>{todayEntry.wakeTime}</Text>
              </View>
            </View>
            <View style={[styles.durationBar, { backgroundColor: colors.bgSecondary }]}>
              <View
                style={[
                  styles.durationFill,
                  {
                    width: `${Math.min((todayEntry.durationMin / 480) * 100, 100)}%`,
                    backgroundColor: QUALITY_COLOR[todayEntry.quality],
                  },
                ]}
              />
            </View>
            <Text style={[styles.durationText, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
              {fmtDur(todayEntry.durationMin)}
            </Text>
          </GlassCard>
        ) : (
          <TouchableOpacity onPress={() => router.push('/add-sleep')}>
            <GlassCard style={styles.emptyToday}>
              <PulseView>
                <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '15' }]}>
                  <Text style={styles.emptyEmoji}>🌙</Text>
                </View>
              </PulseView>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                {isRu ? 'Отслеживай сон' : 'Track your sleep'}
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu
                  ? 'Как спалось сегодня?\nЗапиши свой сон'
                  : 'How did you sleep?\nLog your sleep'}
              </Text>
            </GlassCard>
          </TouchableOpacity>
        )}

        {/* Sleep chart */}
        {entries.length > 0 && (
          <GlassCard style={styles.chartCard}>
            <SleepChart entries={entries} isRu={isRu} />
          </GlassCard>
        )}

        {/* Sleep trend chart */}
        {entries.length > 0 && (
          <GlassCard style={styles.chartCard}>
            <SleepTrendChart isRu={isRu} />
          </GlassCard>
        )}

        {/* Week avg */}
        <GlassCard style={styles.avgCard}>
          <View style={[styles.avgIconBadge, { backgroundColor: colors.accent + '18' }]}>
            <Ionicons name="stats-chart" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.avgLabel, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>
            {isRu ? 'Среднее за неделю' : 'Weekly average'}
          </Text>
          <Text style={[styles.avgValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
            {weekAvg > 0 ? fmtDur(weekAvg) : '—'}
          </Text>
        </GlassCard>

        {/* History */}
        {entries.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {isRu ? 'История' : 'History'}
            </Text>
            <View style={styles.historyList}>
              {entries.slice(0, 14).map((entry) => (
                <GlassCard key={entry.id} style={styles.historyRow}>
                  <Text style={[styles.historyDate, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>{entry.date}</Text>
                  <View style={[styles.historyQualityBadge, { backgroundColor: QUALITY_COLOR[entry.quality] + '18' }]}>
                    <Ionicons name={QUALITY_ICON[entry.quality] ?? 'moon'} size={16} color={QUALITY_COLOR[entry.quality]} />
                  </View>
                  <Text style={[styles.historyDur, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>{fmtDur(entry.durationMin)}</Text>
                  <View style={styles.historyTimes}>
                    <Text style={[styles.historyTime, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>{entry.bedTime}</Text>
                    <Ionicons name="arrow-forward" size={12} color={colors.textSecondary} />
                    <Text style={[styles.historyTime, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>{entry.wakeTime}</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  todayCard: {
    marginBottom: spacing.md,
  },
  todayLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  todayStat: {
    alignItems: 'center',
    gap: 6,
  },
  qualityBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayQuality: {
    fontSize: 13,
  },
  todayTime: {
    fontSize: 15,
    marginTop: 2,
  },
  durationBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  durationFill: {
    height: '100%',
    borderRadius: 4,
  },
  durationText: {
    fontSize: 14,
    textAlign: 'right',
  },

  emptyToday: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  avgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.lg,
  },
  chartCard: {
    marginBottom: spacing.md,
  },
  avgIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avgLabel: {
    fontSize: 15,
    flex: 1,
  },
  avgValue: {
    fontSize: 18,
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  historyList: { gap: 8 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyDate: {
    fontSize: 13,
    width: 80,
  },
  historyQualityBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDur: {
    fontSize: 14,
    flex: 1,
  },
  historyTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyTime: {
    fontSize: 13,
  },
});
