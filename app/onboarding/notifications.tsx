import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { Button } from '../../src/components/ui/Button';
import { requestNotificationPermission, rescheduleAll } from '../../src/services/notifications';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);
  const setHasOnboarded = useSettingsStore((s) => s.setHasOnboarded);
  const locale = useSettingsStore((s) => s.locale);

  const finishOnboarding = () => {
    setHasOnboarded(true);
    router.replace('/(tabs)');
  };

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await rescheduleAll(locale);
    }
    finishOnboarding();
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.emoji}>
            🔔
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(400).duration(500).springify().damping(16)}
            style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}
          >
            {t('onboarding.notifications.title')}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(600).duration(500).springify().damping(16)}
            style={[styles.subtitle, { color: colors.textSecondary, fontFamily: typography.family.regular }]}
          >
            {t('onboarding.notifications.subtitle')}
          </Animated.Text>
        </View>
        <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.bottom}>
          <Button title={t('onboarding.notifications.enable')} onPress={handleEnable} />
          <Button
            title={t('onboarding.notifications.later')}
            onPress={finishOnboarding}
            variant="ghost"
            style={styles.laterBtn}
          />
        </Animated.View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size.hero,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.size.h3,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.xl,
  },
  bottom: {
    paddingBottom: spacing.xxl,
  },
  laterBtn: {
    marginTop: spacing.sm,
  },
});
