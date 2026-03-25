import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { Button } from '../../src/components/ui/Button';
import { PageIndicator } from '../../src/components/ui/PageIndicator';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { spacing, typography } from '../../src/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeStore((s) => s.colors);

  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(8, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <SafeArea>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.delay(100).duration(400)} style={styles.indicator}>
          <PageIndicator total={3} current={0} />
        </Animated.View>
        <View style={styles.hero}>
          <Animated.View entering={BounceIn.delay(200).duration(700)} style={floatStyle}>
            <Animated.Text style={styles.emoji}>🌿</Animated.Text>
          </Animated.View>
          <Animated.Text
            entering={FadeInUp.delay(500).duration(500).springify().damping(16)}
            style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}
          >
            {t('onboarding.welcome.title')}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(700).duration(500).springify().damping(16)}
            style={[styles.subtitle, { color: colors.textSecondary, fontFamily: typography.family.regular }]}
          >
            {t('onboarding.welcome.subtitle')}
          </Animated.Text>
        </View>
        <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.bottom}>
          <Button
            title={t('onboarding.welcome.cta')}
            onPress={() => router.push('/onboarding/location')}
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
  indicator: {
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.size.hero + 2,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
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
});
