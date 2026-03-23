import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { useToastStore } from '../../stores/useToastStore';
import { radius, spacing, typography } from '../../theme/tokens';

export function Toast() {
  const current = useToastStore((s) => s.current);
  const dismiss = useToastStore((s) => s.dismiss);
  const colors = useThemeStore((s) => s.colors);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (current) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [current]);

  if (!current) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceCard, borderColor: colors.accent + '30', transform: [{ translateY }], opacity },
      ]}
    >
      <TouchableOpacity style={styles.inner} onPress={dismiss} activeOpacity={0.8}>
        {current.icon ? (
          <Text style={styles.icon}>{current.icon}</Text>
        ) : null}
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.semibold }]} numberOfLines={1}>
            {current.title}
          </Text>
          {current.subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: typography.family.regular }]} numberOfLines={1}>
              {current.subtitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.xl,
    right: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 9999,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: 12,
  },
  icon: {
    fontSize: 28,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.body,
  },
  subtitle: {
    fontSize: typography.size.caption,
    marginTop: 2,
  },
});
