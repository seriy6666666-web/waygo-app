import React from 'react';
import { Platform, Pressable, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { hapticLight } from '../../utils/haptics';

interface PressableScaleProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  scaleTo?: number;
  noHaptic?: boolean;
}

export function PressableScale({ children, style, onPress, scaleTo = 0.97, noHaptic }: PressableScaleProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (!noHaptic) hapticLight();
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // On web, skip scale animation to avoid reanimated issues
  if (Platform.OS === 'web') {
    return (
      <Pressable onPress={handlePress} style={style as any}>
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      onPress={handlePress}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
