import React from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  direction?: 'up' | 'down';
}

export function AnimatedCard({ children, index = 0, direction = 'up' }: AnimatedCardProps) {
  const delay = index * 80;
  const entering = direction === 'up'
    ? FadeInUp.delay(delay).duration(500).springify().damping(18)
    : FadeInDown.delay(delay).duration(500).springify().damping(18);

  return (
    <Animated.View entering={entering}>
      {children}
    </Animated.View>
  );
}
