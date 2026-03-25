import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { spacing, typography } from '../../theme/tokens';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSettings?: boolean;
}

export function Header({ title, subtitle, showSettings = true }: HeaderProps) {
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {showSettings && (
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.h2,
    fontFamily: typography.family.bold,
  },
  subtitle: {
    fontSize: typography.size.caption,
    marginTop: 4,
    fontFamily: typography.family.regular,
  },
  settingsBtn: {
    padding: spacing.xs,
  },
});
