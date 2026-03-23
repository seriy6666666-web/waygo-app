import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import type { SleepEntry } from '../../types';

interface Props {
  entries: SleepEntry[];
  isRu: boolean;
}

const BAR_MAX_HEIGHT = 100;
const TARGET_HOURS = 8;

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getQualityColor(quality: string): string {
  switch (quality) {
    case 'great': return '#34D399';
    case 'ok': return '#6FAEA5';
    case 'meh': return '#FBBF24';
    case 'bad': return '#EF4444';
    default: return '#6FAEA5';
  }
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getDayOfWeekIndex(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  return (d.getDay() + 6) % 7; // Mon=0
}

export function SleepChart({ entries, isRu }: Props) {
  const colors = useThemeStore((s) => s.colors);
  const days = getLast7Days();
  const weekdays = isRu ? WEEKDAYS_RU : WEEKDAYS_EN;

  const entryMap = new Map<string, SleepEntry>();
  for (const e of entries) {
    if (!entryMap.has(e.date)) entryMap.set(e.date, e);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
        {isRu ? 'Сон за неделю' : 'Sleep this week'}
      </Text>

      {/* Target line label */}
      <View style={styles.targetRow}>
        <View style={[styles.targetLine, { backgroundColor: colors.accent + '40' }]} />
        <Text style={[styles.targetLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
          {TARGET_HOURS}{isRu ? 'ч' : 'h'}
        </Text>
      </View>

      <View style={styles.chart}>
        {days.map((date) => {
          const entry = entryMap.get(date);
          const hours = entry ? entry.durationMin / 60 : 0;
          const height = Math.min((hours / (TARGET_HOURS * 1.25)) * BAR_MAX_HEIGHT, BAR_MAX_HEIGHT);
          const dayIdx = getDayOfWeekIndex(date);
          const barColor = entry ? getQualityColor(entry.quality) : colors.surfaceCardAlt;

          return (
            <View key={date} style={styles.barCol}>
              <View style={[styles.barTrack, { height: BAR_MAX_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(height, 4), backgroundColor: barColor, borderRadius: 6 },
                  ]}
                />
              </View>
              {entry && (
                <Text style={[styles.barValue, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>
                  {hours.toFixed(1)}
                </Text>
              )}
              <Text style={[styles.dayLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {weekdays[dayIdx]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.h3,
    marginBottom: spacing.sm,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  targetLine: {
    flex: 1,
    height: 1,
  },
  targetLabel: {
    fontSize: typography.size.chip,
    marginLeft: 6,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    minHeight: 4,
  },
  barValue: {
    fontSize: 11,
    marginTop: 4,
  },
  dayLabel: {
    fontSize: typography.size.chip,
    marginTop: 2,
  },
});
