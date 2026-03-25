import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import {
    runOnJS,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  style?: StyleProp<TextStyle>;
}

export function AnimatedNumber({ value, duration = 800, decimals = 0, style }: AnimatedNumberProps) {
  const animValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    animValue.value = withTiming(value, { duration });
  }, [value]);

  const updateDisplay = (v: number) => {
    setDisplayValue(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString());
  };

  useAnimatedReaction(
    () => animValue.value,
    (current) => {
      runOnJS(updateDisplay)(current);
    },
    [decimals],
  );

  return <Text style={style}>{displayValue}</Text>;
}
