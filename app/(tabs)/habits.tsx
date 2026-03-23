import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ContributionGraph } from '../../src/components/charts/ContributionGraph';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useHabitStore } from '../../src/stores/useHabitStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { radius, spacing, typography } from '../../src/theme/tokens';
import { getTodayDate } from '../../src/utils/date';

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HABIT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: 'water',
  meditation: 'flower',
  reading: 'book',
  stretching: 'body',
  'no-phone': 'phone-portrait-outline',
  gratitude: 'heart',
  custom: 'star',
};

const HABIT_COLOR_FALLBACK = '#7C5CFC';

export default function HabitsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const { habits, todayLogs, toggle } = useHabitStore();
  const today = getTodayDate();

  const weekdays = i18n.language === 'ru' ? WEEKDAYS_RU : WEEKDAYS_EN;
  const todayIndex = (new Date().getDay() + 6) % 7; // Mon=0

  const progress = useHabitStore.getState().getTodayProgress();
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <SafeArea>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
            {t('habits.title')}
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/add-habit')}
          >
            <Ionicons name="add" size={22} color={colors.textInverse} />
          </TouchableOpacity>
        </View>

        {/* Week strip */}
        <View style={styles.weekStrip}>
          {weekdays.map((day, i) => (
            <View
              key={day}
              style={[
                styles.weekDay,
                i === todayIndex && { backgroundColor: colors.accent },
              ]}
            >
              <Text
                style={[
                  styles.weekDayText,
                  { color: colors.textSecondary, fontFamily: typography.family.medium },
                  i === todayIndex && { color: colors.textInverse },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <GlassCard style={styles.progressCard}>
          <View style={[styles.progressRing, { borderColor: colors.accent }]}>
            <Text style={[styles.progressPct, { color: colors.accent, fontFamily: typography.family.bold }]}>
              {pct}%
            </Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {progress.done}/{progress.total}
            </Text>
            <Text style={[styles.progressSub, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {i18n.language === 'ru' ? 'выполнено сегодня' : 'done today'}
            </Text>
          </View>
        </GlassCard>

        {/* Contribution graph */}
        {habits.length > 0 && (
          <GlassCard style={styles.graphCard}>
            <ContributionGraph isRu={i18n.language === 'ru'} />
          </GlassCard>
        )}

        {/* Habit list */}
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="leaf" size={36} color={colors.accent} />
            </View>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {i18n.language === 'ru'
                ? 'Добавь первую привычку\nи начни строить ритм дня'
                : 'Add your first habit\nand start building your daily rhythm'}
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/add-habit')}
            >
              <Text style={[styles.emptyBtnText, { color: colors.textInverse, fontFamily: typography.family.semibold }]}>
                {t('habits.add')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitList}>
            {habits.map((habit, idx) => {
              const done = todayLogs[habit.id] ?? false;
              const iconName = HABIT_ICON[habit.icon] ?? 'star';
              const color = habit.color || HABIT_COLOR_FALLBACK;
              return (
                <AnimatedCard key={habit.id} index={idx}>
                  <Pressable onPress={() => toggle(habit.id)}>
                    <GlassCard style={{...styles.habitRow, ...(done ? styles.habitRowDone : {})}}>
                      <View
                        style={[
                          styles.habitCheck,
                          { borderColor: color },
                          done && { backgroundColor: color },
                        ]}
                      >
                        {done && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </View>
                      <View style={[styles.habitIconBadge, { backgroundColor: color + '18' }]}>
                        <Ionicons name={iconName} size={20} color={color} />
                      </View>
                      <Text
                        style={[
                          styles.habitName,
                          { color: colors.textPrimary, fontFamily: typography.family.semibold },
                          done && { textDecorationLine: 'line-through', color: colors.textSecondary },
                        ]}
                      >
                        {habit.name}
                      </Text>
                      <Ionicons
                        name={done ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={done ? color : colors.textSecondary}
                      />
                    </GlassCard>
                  </Pressable>
                </AnimatedCard>
              );
            })}
          </View>
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
    fontFamily: typography.family.bold,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  weekDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 13,
    fontFamily: typography.family.semibold,
  },

  graphCard: {
    marginBottom: spacing.md,
  },

  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  progressRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  progressPct: {
    fontSize: 18,
    fontFamily: typography.family.bold,
  },
  progressInfo: { flex: 1 },
  progressLabel: {
    fontSize: 20,
    fontFamily: typography.family.bold,
  },
  progressSub: {
    fontSize: 14,
    marginTop: 2,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  emptyBtnText: {
    fontSize: 16,
    fontFamily: typography.family.semibold,
  },

  habitList: { gap: 12 },
  habitRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  habitRowDone: {
    opacity: 0.7,
  },
  habitCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  habitIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
});
