import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { AmbientBackground } from './AmbientBackground';

interface SafeAreaProps {
  children: React.ReactNode;
  noAmbient?: boolean;
}

export function SafeArea({ children, noAmbient }: SafeAreaProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <StatusBar barStyle={colors.statusBarStyle} />
      {!noAmbient && <AmbientBackground />}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
