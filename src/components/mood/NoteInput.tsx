import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { radius, spacing, typography } from '../../theme/tokens';

interface NoteInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function NoteInput({ value, onChangeText }: NoteInputProps) {
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceCardAlt, borderColor: colors.stroke }]}>
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder={t('mood.note')}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: {
    padding: spacing.md,
    fontSize: typography.size.body,
    fontFamily: typography.family.regular,
    minHeight: 100,
  },
});
