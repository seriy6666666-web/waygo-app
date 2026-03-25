import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
} from 'react-native-reanimated';
import { getSleepBetween } from '../../services/database';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import { hapticSelection } from '../../utils/haptics';

type Period = 7 | 30 | 90;

interface Props {
  isRu: boolean;
}

const BAR_MAX_HEIGHT = 80;
const PERIOD_LABELS: Record<Period, { ru: string; en: string }> = {
  7: { ru: '7 дн', en: '7d' },
  30: { ru: '30 дн', en: '30d' },
  90: { ru: '90 дн', en: '90d' },
};

function getDateRange(days: number): { start: string; end: string; dates: string[] } {
  const dates: string[] = [];
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  return {
    start: dates[0],
    end: dates[dates.length - 1],
    dates,
  };
}

function bucketDates(dates: string[], values: Map<string, number>, maxBars: number): { label: string; avg: number }[] {
  if (dates.length <= maxBars) {
    return dates.map((d) => ({
      label: d.slice(5),
      avg: values.get(d) ?? 0,
    }));
  }

  const bucketSize = Math.ceil(dates.length / maxBars);
  const buckets: { label: string; avg: number }[] = [];

  for (let i = 0; i < dates.length; i += bucketSize) {
    const slice = dates.slice(i, i + bucketSize);
    const vals = slice.map((d) => values.get(d) ?? 0).filter((v) => v > 0);
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    buckets.push({
      label: slice[0].slice(5),
      avg,
    });
  }

  return buckets;
}

export function SleepTrendChart({ isRu }: Props) {
  const colors = useThemeStore((s) => s.colors);
  const [period, setPeriod] = useState<Period>(7);
  const [data, setData] = useState<{ label: string; avg: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { start, end, dates } = getDateRange(period);
      const entries = await getSleepBetween(start, end);
      const map = new Map<string, number>();
      for (const e of entries) {
        map.set(e.date, e.duration_min / 60);
      }

      const maxBars = period <= 7 ? 7 : period <= 30 ? 10 : 12;
      setData(bucketDates(dates, map, maxBars));
    })();
  }, [period]);

  const maxVal = Math.max(...data.map((d) => d.avg), 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
          {isRu ? 'Тренд сна' : 'Sleep trend'}
        </Text>
        <View style={styles.periods}>
          {([7, 30, 90] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => { hapticSelection(); setPeriod(p); }}
              style={[
                styles.periodBtn,
                {
                  backgroundColor: period === p ? colors.accent : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: period === p ? colors.textInverse : colors.textSecondary,
                    fontFamily: typography.family.medium,
                  },
                ]}
              >
                {isRu ? PERIOD_LABELS[p].ru : PERIOD_LABELS[p].en}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View
        layout={LinearTransition.duration(300)}
        style={styles.chart}
      >
        {data.map((item, i) => {
          const height = maxVal > 0 ? (item.avg / maxVal) * BAR_MAX_HEIGHT : 0;
          return (
            <Animated.View
              key={`${period}-${i}`}
              entering={FadeIn.delay(i * 30).duration(300)}
              style={styles.barCol}
            >
              <View style={[styles.barTrack, { height: BAR_MAX_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(height, 3),
                      backgroundColor: item.avg >= 7 ? colors.accent : item.avg >= 5 ? colors.accent + '80' : colors.accent + '40',
                    },
                  ]}
                />
              </View>
              {period <= 7 && item.avg > 0 && (
                <Text style={[styles.barValue, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>
                  {item.avg.toFixed(1)}
                </Text>
              )}
              <Text
                style={[styles.barLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.h3,
  },
  periods: {
    flexDirection: 'row',
    gap: 4,
  },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  periodText: {
    fontSize: 12,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    minHeight: 3,
    borderRadius: 4,
  },
  barValue: {
    fontSize: 10,
    marginTop: 3,
  },
  barLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
