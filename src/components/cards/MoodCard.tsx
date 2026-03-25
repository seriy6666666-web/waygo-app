import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';
import type { MoodKey } from '../../types';
import { MOOD_LABELS } from '../../types';
import { Chip } from '../ui/Chip';
import { GlassCard } from '../ui/GlassCard';

interface MoodCardProps {
  currentMood: MoodKey | null;
  onSelectMood: () => void;
}

const MOOD_KEYS: MoodKey[] = ['calm', 'light', 'focused', 'tired', 'inspired', 'reflective'];

export function MoodCard({ currentMood, onSelectMood }: MoodCardProps) {
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);

  return (
    <GlassCard>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.accentMood + '30', colors.accentMood + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBadge}
        >
          <Ionicons name="happy" size={18} color={colors.accentMood} />
        </LinearGradient>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
          {t('home.moodCard.label') || 'Настроение'}
        </Text>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>
        {t('home.moodCard.title')}
      </Text>
      <View style={styles.chips}>
        {MOOD_KEYS.map((key) => (
          <Chip
            key={key}
            label={t(`mood.moods.${key}`)}
            emoji={MOOD_LABELS[key].emoji}
            selected={currentMood === key}
            onPress={onSelectMood}
          />
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.size.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: typography.size.h3,
    marginBottom: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
