import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MemoryTeaser } from '../../src/components/cards/MemoryTeaser';
import { MoodCard } from '../../src/components/cards/MoodCard';
import { MoveCard } from '../../src/components/cards/MoveCard';
import { RhythmRow } from '../../src/components/cards/RhythmRow';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { SkeletonCard } from '../../src/components/ui/Skeleton';
import { generateCurrentWeekRecap, generateTodayDayCard, loadRecaps, loadRecentCards } from '../../src/services/dataGeneration';
import { getDayCardByDate, getMoodsByDate, getStreakDays, getWeekWalkDays, getWeekWalksCount } from '../../src/services/database';
import { getCurrentPosition } from '../../src/services/location';
import { fetchWeather } from '../../src/services/weather';
import { useDayStore } from '../../src/stores/useDayStore';
import { useMoodStore } from '../../src/stores/useMoodStore';
import { useRecapStore } from '../../src/stores/useRecapStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { useWalkStore } from '../../src/stores/useWalkStore';
import { getGreeting, getTimeTips } from '../../src/theme/adaptive';
import { spacing, typography } from '../../src/theme/tokens';
import { formatDateRu, getDayOfWeekRu } from '../../src/utils/date';
import { hapticLight } from '../../src/utils/haptics';

const TIME_EMOJI: Record<string, string> = {
  morning: '🌅',
  day: '☀️',
  evening: '🌇',
  night: '🌙',
};

const WEATHER_ICON: Record<string, { icon: string; label: { ru: string; en: string } }> = {
  clear: { icon: '☀️', label: { ru: 'Ясно', en: 'Clear' } },
  cloudy: { icon: '☁️', label: { ru: 'Облачно', en: 'Cloudy' } },
  rain: { icon: '🌧️', label: { ru: 'Дождь', en: 'Rain' } },
  snowFog: { icon: '🌨️', label: { ru: 'Снег/Туман', en: 'Snow/Fog' } },
};

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRu = i18n.language === 'ru';
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const weather = useThemeStore((s) => s.weather);
  const setWeather = useThemeStore((s) => s.setWeather);
  const todayWalks = useWalkStore((s) => s.todayWalks);
  const latestMood = useMoodStore((s) => s.latestMood);
  const name = useSettingsStore((s) => s.name);
  const setTodayCard = useDayStore((s) => s.setTodayCard);
  const setRecentCards = useDayStore((s) => s.setRecentCards);
  const setCurrentRecap = useRecapStore((s) => s.setCurrentRecap);
  const setRecaps = useRecapStore((s) => s.setRecaps);
  const weeklyGoal = useSettingsStore((s) => s.weeklyGoal) || 5;

  const [streakDays, setStreakDays] = useState(0);
  const [weekDays, setWeekDays] = useState<('full' | 'half' | 'empty')[]>(Array(7).fill('empty'));
  const [weekWalksCount, setWeekWalksCount] = useState(0);
  const [yesterdayCard, setYesterdayCard] = useState<{ date: string; mood?: string; note?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
      // Fetch weather + update theme
      const pos = await getCurrentPosition();
      let weatherCode: number | null = null;
      if (pos) {
        const w = await fetchWeather(pos.lat, pos.lng);
        if (w && mounted) {
          setWeather(w);
          weatherCode = w.code;
        }
      }
      if (!mounted) return;

      // Auto-generate today's day card
      const card = await generateTodayDayCard(weatherCode);
      if (card && mounted) setTodayCard(card);

      // Load recent cards for archive
      const cards = await loadRecentCards();
      if (mounted) setRecentCards(cards);

      // Auto-generate weekly recap
      const recap = await generateCurrentWeekRecap();
      if (recap && mounted) setCurrentRecap(recap);
      const allRecaps = await loadRecaps();
      if (mounted) setRecaps(allRecaps);

      // Load streak + week data
      const [streak, wDays, wCount] = await Promise.all([
        getStreakDays(),
        getWeekWalkDays(),
        getWeekWalksCount(),
      ]);
      if (mounted) {
        setStreakDays(streak);
        setWeekDays(wDays);
        setWeekWalksCount(wCount);
      }

      // Load yesterday's card for memory teaser
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yDate = yesterday.toISOString().split('T')[0];
      const yCard = await getDayCardByDate(yDate);
      if (yCard && mounted) {
        const yMoods = await getMoodsByDate(yDate) as any[];
        const firstMood = yMoods[0];
        setYesterdayCard({
          date: yDate,
          mood: firstMood?.mood,
          note: firstMood?.note || undefined,
        });
      }
      } catch (err) {
        console.warn('Home data load failed:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [todayWalks.length, latestMood]);

  const now = new Date();
  const dateStr = formatDateRu(now);
  const dayStr = getDayOfWeekRu(now);

  const greeting = getGreeting(timeBucket, name || (isRu ? 'друг' : 'friend'), isRu);
  const tips = useMemo(() => getTimeTips(timeBucket, isRu), [timeBucket, isRu]);
  const tip = tips[now.getMinutes() % tips.length];

  // Typewriter effect for greeting
  const [typedGreeting, setTypedGreeting] = useState('');
  useEffect(() => {
    setTypedGreeting('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedGreeting(greeting.slice(0, i));
      if (i >= greeting.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [greeting]);

  const hasWalkToday = todayWalks.length > 0;
  const totalDurationMin = todayWalks.reduce((a, w) => a + w.durationSec, 0) / 60;
  const totalDistanceKm = todayWalks.reduce((a, w) => a + w.distanceM, 0) / 1000;

  return (
    <SafeArea>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Header */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingEmoji]}>{TIME_EMOJI[timeBucket]}</Text>
          <Text style={[styles.greeting, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
            {typedGreeting}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
            {dateStr}, {dayStr}
          </Text>
          {weather && (
            <View style={styles.weatherRow}>
              <Text style={styles.weatherEmoji}>
                {WEATHER_ICON[weather.bucket]?.icon ?? '🌤️'}
              </Text>
              <Text style={[styles.weatherText, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>
                {Math.round(weather.temperature)}° · {isRu ? WEATHER_ICON[weather.bucket]?.label.ru : WEATHER_ICON[weather.bucket]?.label.en}
              </Text>
            </View>
          )}
        </View>

        {/* Tip Card */}
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
        <>
        <AnimatedCard index={0}>
          <GlassCard intensity="soft" style={styles.tipCard}>
            <View style={styles.tipRow}>
              <Ionicons name="sparkles" size={16} color={colors.accent} />
              <Text style={[styles.tipText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {tip}
              </Text>
            </View>
          </GlassCard>
        </AnimatedCard>

        {/* Move Card */}
        <AnimatedCard index={1}>
          <PressableScale>
            <MoveCard
              hasWalkToday={hasWalkToday}
              durationMin={Math.round(totalDurationMin)}
              distanceKm={totalDistanceKm}
              onStartWalk={() => router.push('/(tabs)/walk')}
            />
          </PressableScale>
        </AnimatedCard>

        {/* Mood Card */}
        <AnimatedCard index={2}>
          <PressableScale onPress={() => router.push('/mood')}>
            <MoodCard
              currentMood={latestMood}
              onSelectMood={() => router.push('/mood')}
            />
          </PressableScale>
        </AnimatedCard>

        {/* Challenges Button */}
        <AnimatedCard index={3}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { hapticLight(); router.push('/challenges'); }}
            style={[styles.exploreBtn, { backgroundColor: colors.surfaceCard }]}
          >
            <Ionicons name="trophy-outline" size={22} color={colors.accent} />
            <Text style={[styles.exploreBtnText, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
              {isRu ? 'Челленджи' : 'Challenges'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </AnimatedCard>

        {/* Explore Map Button */}
        <AnimatedCard index={4}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { hapticLight(); router.push('/explore-map'); }}
            style={[styles.exploreBtn, { backgroundColor: colors.surfaceCard }]}
          >
            <Ionicons name="map-outline" size={22} color={colors.accent} />
            <Text style={[styles.exploreBtnText, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
              {isRu ? 'Карта открытий' : 'Explore Map'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </AnimatedCard>

        {/* Memory Teaser (yesterday) */}
        {yesterdayCard && (
          <AnimatedCard index={5}>
            <MemoryTeaser
              date={yesterdayCard.date}
              mood={yesterdayCard.mood}
              note={yesterdayCard.note}
              onPress={() => router.push(`/day-card/${yesterdayCard.date}`)}
            />
          </AnimatedCard>
        )}

        {/* Rhythm Row */}
        <AnimatedCard index={6}>
          <RhythmRow
            streakDays={streakDays}
            currentGoal={weekWalksCount}
            targetGoal={weeklyGoal}
            weekDays={weekDays}
          />
        </AnimatedCard>
        </>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: 100,
  },
  greetingSection: {
    paddingTop: spacing.md,
    gap: 4,
  },
  greetingEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  greeting: {
    fontSize: typography.size.h1 + 2,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: typography.size.caption,
    letterSpacing: 0.3,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  weatherEmoji: {
    fontSize: 16,
  },
  weatherText: {
    fontSize: typography.size.caption,
  },
  tipCard: {
    marginTop: -4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: typography.size.caption,
    flex: 1,
    lineHeight: 18,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md + 2,
    borderRadius: 24,
  },
  exploreBtnText: {
    flex: 1,
    fontSize: typography.size.body,
  },
});
