import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../../src/components/layout/SafeArea';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PulseView } from '../../src/components/ui/PulseView';
import { SaveSheet } from '../../src/components/walk/SaveSheet';
import { WalkMapView } from '../../src/components/walk/WalkMapView';
import { insertWalk } from '../../src/services/database';
import { requestLocationPermission, startBackgroundTracking, startLocationTracking, stopBackgroundTracking } from '../../src/services/location';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { useToastStore } from '../../src/stores/useToastStore';
import { useWalkStore } from '../../src/stores/useWalkStore';
import { radius, spacing, typography } from '../../src/theme/tokens';
import { generateId } from '../../src/utils/date';
import { formatDistance, formatTime } from '../../src/utils/formatters';
import { hapticMedium, hapticSuccess } from '../../src/utils/haptics';
import { calculateCalories, calculateDistance, calculateSpeed } from '../../src/utils/stats';

export default function WalkScreen() {
  const { t, i18n } = useTranslation();
  const isRu = i18n.language === 'ru';
  const colors = useThemeStore((s) => s.colors);
  const {
    isActive, isPaused, currentWalk,
    startWalk, pauseWalk, resumeWalk,
    addRoutePoint, updateDuration, updateSteps, finishWalk, reset,
  } = useWalkStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationRef = useRef<{ remove: () => void } | null>(null);
  const pedometerRef = useRef<{ remove: () => void } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [pendingWalkStats, setPendingWalkStats] = useState<{
    distanceM: number; durationSec: number; calories: number; speed: number; steps: number;
  } | null>(null);

  // Timer
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          updateDuration(next);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  // Location tracking (foreground + background)
  useEffect(() => {
    if (isActive && !isPaused) {
      (async () => {
        const tracker = await startLocationTracking((lat, lng) => {
          addRoutePoint({ lat, lng, ts: Date.now() });
        });
        if (tracker) {
          locationRef.current = tracker;
        } else {
          console.warn('Foreground location tracking failed to start');
        }

        // Also start background tracking for when app is minimized
        startBackgroundTracking((lat, lng) => {
          addRoutePoint({ lat, lng, ts: Date.now() });
        }).catch(() => {});
      })();
    } else {
      locationRef.current?.remove();
      stopBackgroundTracking();
    }

    return () => {
      locationRef.current?.remove();
    };
  }, [isActive, isPaused]);

  // Pedometer tracking
  useEffect(() => {
    if (isActive && !isPaused) {
      Pedometer.isAvailableAsync().then((available) => {
        if (available) {
          pedometerRef.current = Pedometer.watchStepCount((result) => {
            updateSteps(result.steps);
          });
        }
      }).catch(() => {});
    } else {
      pedometerRef.current?.remove();
    }
    return () => pedometerRef.current?.remove();
  }, [isActive, isPaused]);

  const handleStart = async () => {
    hapticMedium();
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      useToastStore.getState().show({
        title: isRu ? 'Нет доступа к геолокации' : 'Location access denied',
        subtitle: isRu ? 'Включите геолокацию для трекинга прогулки' : 'Enable location to track your walk',
        icon: '📍',
      });
      return;
    }
    setElapsed(0);
    startWalk();
  };

  const handleFinish = async () => {
    const route = currentWalk.route;
    const distanceM = calculateDistance(route);
    const durationSec = currentWalk.durationSec;
    const calories = calculateCalories(distanceM / 1000);
    const speed = calculateSpeed(distanceM, durationSec);

    setPendingWalkStats({ distanceM, durationSec, calories, speed, steps: currentWalk.steps });
    setShowSaveSheet(true);
  };

  const handleSaveConfirm = async () => {
    if (!pendingWalkStats) return;
    await stopBackgroundTracking();
    const route = currentWalk.route;
    const { distanceM, durationSec, calories } = pendingWalkStats;
    const id = generateId();

    const walk = {
      id,
      startedAt: currentWalk.startedAt!,
      endedAt: new Date().toISOString(),
      durationSec,
      distanceM,
      steps: currentWalk.steps,
      calories,
      route,
      synced: false,
    };

    try {
      await insertWalk({ ...walk, route: JSON.stringify(route) });
      finishWalk(walk);
      hapticSuccess();
      useAchievementStore.getState().checkAndUnlock();
    } catch (err) {
      console.error('Failed to save walk:', err);
      useToastStore.getState().show({
        title: isRu ? 'Ошибка сохранения' : 'Save failed',
        subtitle: isRu ? 'Попробуйте ещё раз' : 'Please try again',
        icon: '❌',
      });
    }
    setElapsed(0);
    setShowSaveSheet(false);
    setPendingWalkStats(null);
  };

  const handleDiscard = () => {
    stopBackgroundTracking();
    reset();
    setElapsed(0);
    setShowSaveSheet(false);
    setPendingWalkStats(null);
  };

  const distanceM = calculateDistance(currentWalk.route);
  const speed = calculateSpeed(distanceM, elapsed);

  return (
    <SafeArea>
      <View style={styles.container}>
        {!isActive ? (
          <View style={styles.idle}>
            <PulseView>
              <View style={[styles.idleIconCircle, { backgroundColor: colors.accent + '15' }]}>
                <Text style={styles.idleEmoji}>👟</Text>
              </View>
            </PulseView>
            <Text style={[styles.idleTitle, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
              {t('walk.start')}
            </Text>
            <Text style={[styles.idleHint, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {t('walk.hint')}
            </Text>
            <TouchableOpacity
              onPress={handleStart}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('walk.start')}
            >
              <LinearGradient
                colors={[colors.accent, colors.accentBright]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.startBtn,
                  Platform.OS === 'ios' && {
                    shadowColor: colors.accent,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 18,
                  },
                ]}
              >
                <Ionicons name="play" size={24} color={colors.textInverse} />
                <Text style={[styles.startBtnText, { color: colors.textInverse, fontFamily: typography.family.semibold }]}>
                  {t('walk.start')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.active}>
            {/* Live Map */}
            <WalkMapView route={currentWalk.route} isLive style={styles.mapContainer} />

            {/* Stats overlay card */}
            <GlassCard intensity="strong" style={styles.statsCard}>
              <Text style={[styles.timer, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                {formatTime(elapsed)}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                    {formatDistance(distanceM)}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    км
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.stroke }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
                    {speed.toFixed(1)}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
                    км/ч
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* Controls */}
            <View style={styles.controls}>
              {isPaused ? (
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={[styles.controlBtn, styles.controlBtnLarge, { backgroundColor: colors.accent }]}
                    onPress={resumeWalk}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={isRu ? 'Продолжить' : 'Resume'}
                  >
                    <Ionicons name="play" size={28} color={colors.textInverse} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlBtn, { backgroundColor: colors.surfaceCardAlt, borderWidth: 1, borderColor: colors.stroke }]}
                    onPress={handleFinish}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={isRu ? 'Завершить' : 'Finish'}
                  >
                    <Ionicons name="stop" size={22} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.controlBtn, styles.controlBtnLarge, { backgroundColor: colors.surfaceCardAlt, borderWidth: 1, borderColor: colors.stroke }]}
                  onPress={pauseWalk}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={isRu ? 'Пауза' : 'Pause'}
                >
                  <Ionicons name="pause" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Save Sheet overlay */}
        {showSaveSheet && pendingWalkStats && (
          <SaveSheet
            durationSec={pendingWalkStats.durationSec}
            distanceM={pendingWalkStats.distanceM}
            speedKmh={pendingWalkStats.speed}
            calories={pendingWalkStats.calories}
            steps={pendingWalkStats.steps}
            isRu={isRu}
            onSave={handleSaveConfirm}
            onDiscard={handleDiscard}
          />
        )}
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  idle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  idleIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  idleTitle: {
    fontSize: typography.size.h1,
    marginBottom: spacing.sm,
  },
  idleHint: {
    fontSize: typography.size.body,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    lineHeight: 24,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 18,
    borderRadius: radius.pill,
  },
  startBtnText: {
    fontSize: typography.size.body,
  },
  idleEmoji: {
    fontSize: 48,
  },
  active: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  statsCard: {
    borderRadius: radius.sheet,
    marginHorizontal: spacing.md,
    marginTop: -40,
  },
  timer: {
    fontSize: 52,
    textAlign: 'center',
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
  },
  statUnit: {
    fontSize: typography.size.caption,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.3,
  },
  controls: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
