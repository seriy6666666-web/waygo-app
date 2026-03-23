import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { Button } from '../../src/components/ui/Button';
import { requestLocationPermission } from '../../src/services/location';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';

export default function LocationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);

  const handleAllow = async () => {
    await requestLocationPermission();
    router.push('/onboarding/notifications');
  };

  const handleLater = () => {
    router.push('/onboarding/notifications');
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Animated.Text entering={FadeIn.delay(200).duration(600)} style={styles.emoji}>
            📍
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(400).duration(500).springify().damping(16)}
            style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}
          >
            {t('onboarding.location.title')}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(600).duration(500).springify().damping(16)}
            style={[styles.subtitle, { color: colors.textSecondary, fontFamily: typography.family.regular }]}
          >
            {t('onboarding.location.subtitle')}
          </Animated.Text>
        </View>
        <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.bottom}>
          <Button title={t('onboarding.location.allow')} onPress={handleAllow} />
          <Button
            title={t('onboarding.location.later')}
            onPress={handleLater}
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
