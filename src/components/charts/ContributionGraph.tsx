import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getHabitLogsBetween } from '../../services/database';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';

interface Props {
  isRu: boolean;
}

const WEEKS = 13; // ~3 months
const CELL_SIZE = 14;
const CELL_GAP = 3;

function getDateGrid(): { dates: string[][]; months: { label: string; col: number }[] } {
  const today = new Date();
  const dates: string[][] = []; // 7 rows x WEEKS cols
  const monthLabels: { label: string; col: number }[] = [];

  // Init 7 rows
  for (let r = 0; r < 7; r++) dates.push([]);

  // Start from (WEEKS*7 - 1) days ago, align to Monday
  const startOffset = WEEKS * 7 - 1;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - startOffset);
  // Align to Monday
  const dayOfWeek = (startDate.getDay() + 6) % 7; // Mon=0
  startDate.setDate(startDate.getDate() - dayOfWeek);

  let lastMonth = -1;
  const totalDays = WEEKS * 7;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const row = i % 7;
    const col = Math.floor(i / 7);
    const dateStr = d.toISOString().split('T')[0];
    dates[row][col] = dateStr;

    // Track month changes
    if (row === 0 && d.getMonth() !== lastMonth) {
      lastMonth = d.getMonth();
      monthLabels.push({ label: MONTH_SHORT[d.getMonth()], col });
    }
  }

  return { dates, months: monthLabels };
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionGraph({ isRu }: Props) {
  const colors = useThemeStore((s) => s.colors);
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());

  const { dates, months } = getDateGrid();

  useEffect(() => {
    (async () => {
      const startDate = dates[0][0];
      const endDate = dates[6][WEEKS - 1] || dates[0][WEEKS - 1];
      const rows = await getHabitLogsBetween(startDate, endDate);
      const map = new Map<string, number>();
      for (const r of rows) {
        map.set(r.date, r.count);
      }
      setActivityMap(map);
    })();
  }, []);

  const getColor = (count: number): string => {
    if (count === 0) return colors.surfaceCardAlt;
    if (count === 1) return colors.accent + '40';
    if (count === 2) return colors.accent + '70';
    if (count >= 3) return colors.accent;
    return colors.surfaceCardAlt;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
        {isRu ? 'Активность привычек' : 'Habit activity'}
      </Text>

      {/* Month labels */}
      <View style={styles.monthRow}>
        {months.map((m, i) => (
          <Text
            key={i}
            style={[
              styles.monthLabel,
              { color: colors.textSecondary, fontFamily: typography.family.regular, left: m.col * (CELL_SIZE + CELL_GAP) },
            ]}
          >
            {m.label}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {dates.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {row.map((date, colIdx) => {
              const count = activityMap.get(date) || 0;
              return (
                <View
                  key={`${rowIdx}-${colIdx}`}
                  style={[
                    styles.cell,
                    { backgroundColor: getColor(count), borderRadius: 3 },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
          {isRu ? 'Меньше' : 'Less'}
        </Text>
        {[0, 1, 2, 3].map((level) => (
          <View key={level} style={[styles.cell, { backgroundColor: getColor(level), borderRadius: 3 }]} />
        ))}
        <Text style={[styles.legendText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
          {isRu ? 'Больше' : 'More'}
        </Text>
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
  monthRow: {
    flexDirection: 'row',
    position: 'relative',
    height: 16,
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 10,
    position: 'absolute',
  },
  grid: {
    gap: CELL_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    justifyContent: 'flex-end',
  },
  legendText: {
    fontSize: 11,
  },
});
