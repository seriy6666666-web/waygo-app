import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { GlassCard } from '../src/components/ui/GlassCard';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { useToastStore } from '../src/stores/useToastStore';
import { spacing, typography } from '../src/theme/tokens';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    name, weeklyGoal, adaptiveAmbiance, locale, freezesLeft,
    setName, setWeeklyGoal, setAdaptiveAmbiance, setLocale, useFreeze,
  } = useSettingsStore();
  const colors = useThemeStore((s) => s.colors);
  const isRu = i18n.language === 'ru';

  const handleFreeze = () => {
    const ok = useFreeze();
    const { show } = useToastStore.getState();
    if (ok) {
      show({ title: isRu ? 'Серия заморожена!' : 'Streak frozen!', subtitle: isRu ? `Осталось: ${freezesLeft - 1}` : `Left: ${freezesLeft - 1}`, icon: '🧊' });
    } else {
      show({ title: isRu ? 'Нет заморозок' : 'No freezes left', icon: '❄️' });
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'ru' ? 'en' : 'ru';
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
  };

  return (
    <SafeArea>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('settings.title')}</Text>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.surfaceCardAlt }]} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>{t('settings.profile')}</Text>
        <GlassCard>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>{t('settings.name')}</Text>
            <TextInput
              style={[styles.nameInput, { color: colors.textPrimary, fontFamily: typography.family.regular, borderColor: colors.stroke }]}
              value={name}
              onChangeText={setName}
              placeholder={isRu ? 'Имя' : 'Name'}
              placeholderTextColor={colors.textSecondary}
              maxLength={20}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.stroke }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>{t('settings.weeklyGoal')}</Text>
            <View style={styles.goalRow}>
              {[3, 5, 7].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.goalBtn, { backgroundColor: colors.surfaceCardAlt, borderColor: colors.stroke }, weeklyGoal === g && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                  onPress={() => setWeeklyGoal(g)}
                >
                  <Text style={[styles.goalText, { color: colors.textPrimary, fontFamily: typography.family.semibold }, weeklyGoal === g && { color: colors.textInverse }]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </GlassCard>

        {/* Atmosphere */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>{t('settings.atmosphere')}</Text>
        <GlassCard>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>{t('settings.adaptiveAmbiance')}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>{t('settings.adaptiveDesc')}</Text>
            </View>
            <Switch
              value={adaptiveAmbiance}
              onValueChange={setAdaptiveAmbiance}
              trackColor={{ true: colors.accent, false: colors.stroke }}
            />
          </View>
        </GlassCard>

        {/* Language */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>{t('settings.language')}</Text>
        <GlassCard>
          <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
            <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>{locale === 'ru' ? 'Русский' : 'English'}</Text>
            <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
          </TouchableOpacity>
        </GlassCard>

        {/* Streak Freeze */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>
          {isRu ? 'ЗАМОРОЗКА СЕРИИ' : 'STREAK FREEZE'}
        </Text>
        <GlassCard>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>
                {isRu ? 'Заморозить сегодня' : 'Freeze today'}
              </Text>
              <Text style={[styles.desc, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                {isRu ? `Осталось: ${freezesLeft}/3 в этом месяце` : `Left: ${freezesLeft}/3 this month`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.freezeBtn, { backgroundColor: freezesLeft > 0 ? colors.accent : colors.surfaceCardAlt }]}
              onPress={handleFreeze}
            >
              <Text style={{ fontSize: 20 }}>🧊</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Achievements */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>{t('achievements.title')}</Text>
        <GlassCard>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/achievements')}>
            <View style={styles.achRow}>
              <Ionicons name="trophy" size={20} color={colors.accent} />
              <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.family.medium }]}>{t('achievements.title')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </GlassCard>

        {/* About */}
        <Text style={[styles.section, { color: colors.textSecondary, fontFamily: typography.family.semibold }]}>{t('settings.about')}</Text>
        <GlassCard>
          <Text style={[styles.about, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>Waygo v1.0 · MVP</Text>
        </GlassCard>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size.h1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    fontSize: typography.size.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: typography.size.body,
  },
  value: {
    fontSize: typography.size.body,
  },
  desc: {
    fontSize: typography.size.caption,
    marginTop: 4,
  },
  goalRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  goalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  goalText: {
    fontSize: typography.size.body,
  },
  about: {
    fontSize: typography.size.caption,
  },
  achRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    fontSize: typography.size.body,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 120,
    textAlign: 'right',
  },
  freezeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
