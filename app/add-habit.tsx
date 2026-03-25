import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { GlassCard } from '../src/components/ui/GlassCard';
import { useHabitStore } from '../src/stores/useHabitStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { radius, spacing, typography } from '../src/theme/tokens';
import type { HabitIcon } from '../src/types';
import { generateId } from '../src/utils/date';
import { hapticMedium, hapticSuccess } from '../src/utils/haptics';

const PRESETS: { icon: HabitIcon; color: string; key: string }[] = [
  { icon: 'water', color: '#5BB8F0', key: 'water' },
  { icon: 'meditation', color: '#A78BFA', key: 'meditation' },
  { icon: 'reading', color: '#F59E42', key: 'reading' },
  { icon: 'stretching', color: '#34D399', key: 'stretching' },
  { icon: 'no-phone', color: '#F472B6', key: 'no-phone' },
  { icon: 'gratitude', color: '#FBBF24', key: 'gratitude' },
];

const HABIT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: 'water',
  meditation: 'flower',
  reading: 'book',
  stretching: 'body',
  'no-phone': 'phone-portrait-outline',
  gratitude: 'heart',
  custom: 'star',
};

const COLORS = ['#5BB8F0', '#A78BFA', '#F59E42', '#34D399', '#F472B6', '#FBBF24', '#6FAEA5', '#EF4444'];

export default function AddHabitScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const addHabit = useHabitStore((s) => s.addHabit);
  const colors = useThemeStore((s) => s.colors);

  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState(COLORS[0]);

  const handlePreset = async (preset: (typeof PRESETS)[0]) => {
    hapticMedium();
    const name =
      i18n.language === 'ru'
        ? t(`habits.presets.${preset.key}`)
        : t(`habits.presets.${preset.key}`);
    await addHabit({
      id: generateId(),
      name,
      icon: preset.icon,
      color: preset.color,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  const handleCustom = async () => {
    if (!customName.trim()) return;
    hapticSuccess();
    await addHabit({
      id: generateId(),
      name: customName.trim(),
      icon: 'custom',
      color: customColor,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeArea>
      <View style={styles.topBar}>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.surfaceCardAlt }]} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={i18n.language === 'ru' ? 'Закрыть' : 'Close'}>
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('habits.add')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.surfaceCardAlt }]}>
          <TouchableOpacity
            style={[styles.tab, mode === 'presets' && { backgroundColor: colors.accent }]}
            onPress={() => setMode('presets')}
            accessibilityRole="tab"
            accessibilityLabel={i18n.language === 'ru' ? 'Готовые' : 'Presets'}
            accessibilityState={{ selected: mode === 'presets' }}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: typography.family.semibold }, mode === 'presets' && { color: colors.textInverse }]}>
              {i18n.language === 'ru' ? 'Готовые' : 'Presets'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'custom' && { backgroundColor: colors.accent }]}
            onPress={() => setMode('custom')}
            accessibilityRole="tab"
            accessibilityLabel={i18n.language === 'ru' ? 'Своя' : 'Custom'}
            accessibilityState={{ selected: mode === 'custom' }}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary, fontFamily: typography.family.semibold }, mode === 'custom' && { color: colors.textInverse }]}>
              {i18n.language === 'ru' ? 'Своя' : 'Custom'}
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'presets' ? (
          <View style={styles.presetGrid}>
            {PRESETS.map((p) => (
              <TouchableOpacity
                key={p.key}
                onPress={() => handlePreset(p)}
                accessibilityRole="button"
                accessibilityLabel={t(`habits.presets.${p.key}`)}
              >
                <GlassCard style={{...styles.presetCard, borderColor: p.color, borderWidth: 2}}>
                  <View style={[styles.presetIconBadge, { backgroundColor: p.color + '20' }]}>
                    <Ionicons name={HABIT_ICON[p.icon] ?? 'star'} size={28} color={p.color} />
                  </View>
                  <Text style={[styles.presetName, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
                    {t(`habits.presets.${p.key}`)}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.customForm}>
            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
              {i18n.language === 'ru' ? 'Название' : 'Name'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceCard, color: colors.textPrimary, fontFamily: typography.family.regular }]}
              value={customName}
              onChangeText={setCustomName}
              placeholder={i18n.language === 'ru' ? 'Например: Зарядка' : 'E.g. Workout'}
              placeholderTextColor={colors.textSecondary}
              maxLength={30}
            />

            <Text style={[styles.label, { marginTop: spacing.md, color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
              {i18n.language === 'ru' ? 'Цвет' : 'Color'}
            </Text>
            <View style={styles.colorRow}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    customColor === c && { borderWidth: 3, borderColor: colors.textPrimary },
                  ]}
                  onPress={() => setCustomColor(c)}
                  accessibilityRole="button"
                  accessibilityLabel={c}
                  accessibilityState={{ selected: customColor === c }}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: colors.accent },
                !customName.trim() && styles.saveBtnDisabled,
              ]}
              onPress={handleCustom}
              disabled={!customName.trim()}
              accessibilityRole="button"
              accessibilityLabel={i18n.language === 'ru' ? 'Добавить' : 'Add'}
              accessibilityState={{ disabled: !customName.trim() }}
            >
              <Text style={[styles.saveBtnText, { color: colors.textInverse, fontFamily: typography.family.bold }]}>
                {i18n.language === 'ru' ? 'Добавить' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
  },
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },

  tabs: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
  },

  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  presetIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetName: {
    fontSize: 15,
  },

  customForm: { paddingTop: spacing.sm },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: radius.md,
    padding: 14,
    fontSize: 16,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  saveBtn: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontSize: 17,
  },
});
