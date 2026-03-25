import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../src/components/layout/Header';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useDayStore } from '../../src/stores/useDayStore';
import { useRecapStore } from '../../src/stores/useRecapStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { radius, spacing, typography } from '../../src/theme/tokens';

type Tab = 'days' | 'weeks';

export default function ArchiveScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('days');
  const [search, setSearch] = useState('');
  const colors = useThemeStore((s) => s.colors);
  const recentCards = useDayStore((s) => s.recentCards);
  const recaps = useRecapStore((s) => s.recaps);
  const isRu = i18n.language === 'ru';

  const filteredCards = useMemo(() => {
    if (!search.trim()) return recentCards;
    const q = search.toLowerCase();
    return recentCards.filter((c) =>
      c.date.includes(q) || c.tags.some((tag: string) => tag.toLowerCase().includes(q))
    );
  }, [recentCards, search]);

  const filteredRecaps = useMemo(() => {
    if (!search.trim()) return recaps;
    const q = search.toLowerCase();
    return recaps.filter((r) => r.weekStart.includes(q) || r.weekEnd.includes(q));
  }, [recaps, search]);

  return (
    <SafeArea>
      <Header title={t('archive.title')} showSettings={false} />

      {/* Tab switcher */}
      <View style={[styles.tabs, { backgroundColor: colors.surfaceCardAlt }]}>
        <TouchableOpacity
          style={[styles.tab, tab === 'days' && { backgroundColor: colors.accent }]}
          onPress={() => setTab('days')}
          accessibilityRole="tab"
          accessibilityLabel={t('archive.days')}
          accessibilityState={{ selected: tab === 'days' }}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: typography.family.semibold }, tab === 'days' && { color: colors.textInverse }]}>
            {t('archive.days')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'weeks' && { backgroundColor: colors.accent }]}
          onPress={() => setTab('weeks')}
          accessibilityRole="tab"
          accessibilityLabel={t('archive.weeks')}
          accessibilityState={{ selected: tab === 'weeks' }}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: typography.family.semibold }, tab === 'weeks' && { color: colors.textInverse }]}>
            {t('archive.weeks')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.surfaceCardAlt }]}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary, fontFamily: typography.family.regular }]}
          placeholder={isRu ? 'Поиск по дате или тегу...' : 'Search by date or tag...'}
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} accessibilityRole="button" accessibilityLabel={isRu ? 'Очистить поиск' : 'Clear search'}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'days' && filteredCards.length === 0 && (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="calendar-outline" size={36} color={colors.accent} />
            </View>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {search ? (isRu ? 'Ничего не найдено' : 'Nothing found') : t('edge.firstDay')}
            </Text>
          </View>
        )}

        {tab === 'days' && filteredCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push(`/day-card/${card.date}`)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${isRu ? 'Карточка дня' : 'Day card'} ${card.date}`}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text-outline" size={18} color={colors.accent} />
                <Text style={[styles.cardDate, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>{card.date}</Text>
              </View>
              <Text style={[styles.cardMeta, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {card.walkIds.length > 0 && `🚶 ${card.walkIds.length}`}
                {card.walkIds.length > 0 && card.moodIds.length > 0 && '  '}
                {card.moodIds.length > 0 && `😊 ${card.moodIds.length}`}
              </Text>
              {card.tags.length > 0 && (
                <Text style={[styles.cardTags, { color: colors.accent, fontFamily: typography.family.medium }]}>
                  {card.tags.map((tag: string) => `#${tag}`).join(' ')}
                </Text>
              )}
            </GlassCard>
          </TouchableOpacity>
        ))}

        {tab === 'weeks' && filteredRecaps.length === 0 && (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="bar-chart-outline" size={36} color={colors.accent} />
            </View>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {search
                ? (isRu ? 'Ничего не найдено' : 'Nothing found')
                : isRu
                  ? 'Недельные итоги появятся после первой полной недели'
                  : 'Weekly summaries will appear after the first full week'}
            </Text>
          </View>
        )}

        {tab === 'weeks' && filteredRecaps.map((recap) => (
          <TouchableOpacity
            key={recap.id}
            onPress={() => router.push(`/recap/${recap.weekStart}`)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${isRu ? 'Итоги недели' : 'Week recap'} ${recap.weekStart}`}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="bar-chart-outline" size={18} color={colors.accent} />
                <Text style={[styles.cardDate, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                  {recap.weekStart} — {recap.weekEnd}
                </Text>
              </View>
              <Text style={[styles.cardTags, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu
                  ? `${recap.totalWalks} прогулок · ${(recap.totalDistanceM / 1000).toFixed(1)} км`
                  : `${recap.totalWalks} walks · ${(recap.totalDistanceM / 1000).toFixed(1)} km`}
              </Text>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  tabText: {
    fontSize: typography.size.body,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 120,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.size.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
    lineHeight: 24,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardDate: {
    fontSize: typography.size.h3,
  },
  cardTags: {
    marginTop: spacing.xs,
    fontSize: typography.size.caption,
  },
  cardMeta: {
    marginTop: 4,
    fontSize: typography.size.body,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.size.body,
    padding: 0,
  },
});
