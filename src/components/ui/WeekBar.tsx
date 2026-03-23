import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing } from '../../theme/tokens';

interface WeekBarProps {
  days: ('full' | 'half' | 'empty')[]; // 7 days Mon-Sun
}

export function WeekBar({ days }: WeekBarProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={styles.row}>
      {days.map((status, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            status === 'full' && { backgroundColor: colors.accent },
            status === 'half' && { backgroundColor: colors.accent, opacity: 0.4 },
            status === 'empty' && { backgroundColor: colors.stroke },
          ]}
        />
      ))}
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
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
