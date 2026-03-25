import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing } from '../../theme/tokens';

interface WeekBarProps {
  days: ('full' | 'half' | 'empty')[]; // 7 days Mon-Sun
}

export function WeekBar({ days }: WeekBarProps) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  return (
    <View style={styles.row}>
      {days.map((status, i) => {
        if (status === 'full') {
          return (
            <LinearGradient
              key={i}
              colors={[colors.accent, colors.accentBright]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dot}
            />
          );
        }
        return (
          <View
            key={i}
            style={[
              styles.dot,
              status === 'half' && { backgroundColor: colors.accent, opacity: 0.35 },
              status === 'empty' && {
                backgroundColor: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});
