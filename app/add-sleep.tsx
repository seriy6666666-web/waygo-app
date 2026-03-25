import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { GlassCard } from '../src/components/ui/GlassCard';
import { useAchievementStore } from '../src/stores/useAchievementStore';
import { useSleepStore } from '../src/stores/useSleepStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { radius, spacing, typography } from '../src/theme/tokens';
import type { SleepQuality } from '../src/types';
import { generateId, getTodayDate } from '../src/utils/date';
import { hapticSuccess } from '../src/utils/haptics';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const QUALITY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  great: 'moon',
  ok: 'partly-sunny',
  meh: 'cloudy',
  bad: 'thunderstorm',
};

const QUALITY_COLOR: Record<string, string> = {
  great: '#34D399',
  ok: '#6FAEA5',
  meh: '#FBBF24',
  bad: '#EF4444',
};

const QUALITIES: { key: SleepQuality }[] = [
  { key: 'great' },
  { key: 'ok' },
  { key: 'meh' },
  { key: 'bad' },
];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function calcDuration(bedH: number, bedM: number, wakeH: number, wakeM: number): number {
  let bedMin = bedH * 60 + bedM;
  let wakeMin = wakeH * 60 + wakeM;
  if (wakeMin <= bedMin) wakeMin += 24 * 60; // overnight
  return wakeMin - bedMin;
}

export default function AddSleepScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const addEntry = useSleepStore((s) => s.addEntry);
  const colors = useThemeStore((s) => s.colors);
  const isRu = i18n.language === 'ru';

  const [bedH, setBedH] = useState(23);
  const [bedM, setBedM] = useState(0);
  const [wakeH, setWakeH] = useState(7);
  const [wakeM, setWakeM] = useState(0);
  const [quality, setQuality] = useState<SleepQuality>('ok');

  const duration = calcDuration(bedH, bedM, wakeH, wakeM);

  const handleSave = async () => {
    hapticSuccess();
    await addEntry({
      id: generateId(),
      date: getTodayDate(),
      bedTime: `${pad(bedH)}:${pad(bedM)}`,
      wakeTime: `${pad(wakeH)}:${pad(wakeM)}`,
      quality,
      durationMin: duration,
      synced: false,
    });
    useAchievementStore.getState().checkAndUnlock();
    router.back();
  };

  return (
    <SafeArea>
      <View style={styles.topBar}>
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.surfaceCardAlt }]} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('sleep.title')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Quality */}
        <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('sleep.quality')}</Text>
        <View style={styles.qualityRow}>
          {QUALITIES.map((q) => {
            const color = QUALITY_COLOR[q.key];
            const active = quality === q.key;
            return (
              <TouchableOpacity
                key={q.key}
                onPress={() => setQuality(q.key)}
              >
                <GlassCard style={{...styles.qualityBtn, ...(active ? { borderColor: color, borderWidth: 2 } : {})}}>
                  <View style={[styles.qualityIconBadge, { backgroundColor: color + '20' }]}>
                    <Ionicons name={QUALITY_ICON[q.key]} size={24} color={color} />
                  </View>
                  <Text
                    style={[
                      styles.qualityLabel,
                      { color: colors.textSecondary, fontFamily: typography.family.medium },
                      active && { color },
                    ]}
                  >
                    {t(`sleep.qualities.${q.key}`)}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bed time */}
        <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('sleep.bedTime')}</Text>
        <View style={styles.timePickerRow}>
          <GlassCard style={styles.timePicker}>
            <TouchableOpacity onPress={() => setBedH((h) => (h + 23) % 24)}>
              <Ionicons name="chevron-up" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.timeValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{pad(bedH)}</Text>
            <TouchableOpacity onPress={() => setBedH((h) => (h + 1) % 24)}>
              <Ionicons name="chevron-down" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlassCard>
          <Text style={[styles.timeSep, { color: colors.textSecondary, fontFamily: typography.family.bold }]}>:</Text>
          <GlassCard style={styles.timePicker}>
            <TouchableOpacity onPress={() => setBedM((m) => (m + 45) % 60)}>
              <Ionicons name="chevron-up" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.timeValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{pad(bedM)}</Text>
            <TouchableOpacity onPress={() => setBedM((m) => (m + 15) % 60)}>
              <Ionicons name="chevron-down" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* Wake time */}
        <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('sleep.wakeTime')}</Text>
        <View style={styles.timePickerRow}>
          <GlassCard style={styles.timePicker}>
            <TouchableOpacity onPress={() => setWakeH((h) => (h + 23) % 24)}>
              <Ionicons name="chevron-up" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.timeValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{pad(wakeH)}</Text>
            <TouchableOpacity onPress={() => setWakeH((h) => (h + 1) % 24)}>
              <Ionicons name="chevron-down" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlassCard>
          <Text style={[styles.timeSep, { color: colors.textSecondary, fontFamily: typography.family.bold }]}>:</Text>
          <GlassCard style={styles.timePicker}>
            <TouchableOpacity onPress={() => setWakeM((m) => (m + 45) % 60)}>
              <Ionicons name="chevron-up" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.timeValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{pad(wakeM)}</Text>
            <TouchableOpacity onPress={() => setWakeM((m) => (m + 15) % 60)}>
              <Ionicons name="chevron-down" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* Duration preview */}
        <GlassCard style={styles.durationCard}>
          <View style={[styles.durationIconBadge, { backgroundColor: colors.accent + '18' }]}>
            <Ionicons name="time" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.durationText, { color: colors.textPrimary, fontFamily: typography.family.semibold }]}>
            {isRu ? `Длительность: ` : `Duration: `}
            {Math.floor(duration / 60)}{isRu ? 'ч' : 'h'} {duration % 60}{isRu ? 'м' : 'm'}
          </Text>
        </GlassCard>

        {/* Save */}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}>
          <Text style={[styles.saveBtnText, { color: colors.textInverse, fontFamily: typography.family.bold }]}>
            {isRu ? 'Сохранить' : 'Save'}
          </Text>
        </TouchableOpacity>
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

  label: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: spacing.md,
  },

  qualityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qualityBtn: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  qualityIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityLabel: {
    fontSize: 12,
  },

  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  timePicker: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  timeValue: {
    fontSize: 36,
    marginVertical: 4,
  },
  timeSep: {
    fontSize: 36,
  },

  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.md,
  },
  durationIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
  },

  saveBtn: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 17,
  },
});
