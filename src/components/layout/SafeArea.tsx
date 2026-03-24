import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/useThemeStore';
import { AmbientBackground } from './AmbientBackground';

interface SafeAreaProps {
  children: React.ReactNode;
  noAmbient?: boolean;
}

export function SafeArea({ children, noAmbient }: SafeAreaProps) {
  const colors = useThemeStore((s) => s.colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={colors.statusBarStyle} translucent backgroundColor="transparent" />
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
