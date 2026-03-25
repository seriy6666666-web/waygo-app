import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../theme/tokens';
import type { MoodKey } from '../../types';
import { MOOD_LABELS } from '../../types';
import { Chip } from '../ui/Chip';

interface MoodChipsProps {
  selected: MoodKey | null;
  onSelect: (mood: MoodKey) => void;
}

const MOOD_KEYS: MoodKey[] = ['calm', 'light', 'focused', 'tired', 'inspired', 'reflective'];

export function MoodChips({ selected, onSelect }: MoodChipsProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'ru';

  return (
    <View style={styles.container}>
      {MOOD_KEYS.map((key) => (
        <Chip
          key={key}
          label={MOOD_LABELS[key][lang]}
          emoji={MOOD_LABELS[key].emoji}
          selected={selected === key}
          onPress={() => onSelect(key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
