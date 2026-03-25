import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';

interface Props {
  total: number;
  current: number;
}

export function PageIndicator({ total, current }: Props) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === current ? colors.accent : colors.accent + '30',
              width: i === current ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
