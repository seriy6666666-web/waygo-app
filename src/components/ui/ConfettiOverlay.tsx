import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CONFETTI_COUNT = 30;
const COLORS = ['#F59E0B', '#34D399', '#8B5CF6', '#F43F5E', '#3B82F6', '#EC4899', '#6EE7B7'];

interface ConfettiPiece {
  x: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
}

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    x: Math.random() * SCREEN_W,
    delay: Math.random() * 400,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    duration: 1800 + Math.random() * 1200,
  }));
}

function Piece({ piece }: { piece: ConfettiPiece }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      piece.delay,
      withTiming(SCREEN_H + 40, { duration: piece.duration, easing: Easing.out(Easing.quad) }),
    );
    rotate.value = withDelay(
      piece.delay,
      withTiming(piece.rotation + 720, { duration: piece.duration }),
    );
    opacity.value = withDelay(
      piece.delay + piece.duration * 0.7,
      withTiming(0, { duration: piece.duration * 0.3 }),
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: piece.x,
          top: -20,
          width: piece.size,
          height: piece.size * 1.4,
          backgroundColor: piece.color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}

interface ConfettiOverlayProps {
  visible: boolean;
  onDone?: () => void;
}

export function ConfettiOverlay({ visible, onDone }: ConfettiOverlayProps) {
  const pieces = useMemo(() => (visible ? generatePieces() : []), [visible]);

  useEffect(() => {
    if (visible && onDone) {
      const timer = setTimeout(onDone, 3200);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <Animated.View style={styles.overlay} pointerEvents="none">
      {pieces.map((piece, i) => (
        <Piece key={i} piece={piece} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});
