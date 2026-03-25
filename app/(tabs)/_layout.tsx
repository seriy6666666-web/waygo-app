import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ConfettiOverlay } from '../../src/components/ui/ConfettiOverlay';
import { useAchievementStore } from '../../src/stores/useAchievementStore';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { typography } from '../../src/theme/tokens';

export default function TabLayout() {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const showConfetti = useAchievementStore((s) => s.showConfetti);
  const dismissConfetti = useAchievementStore((s) => s.dismissConfetti);
  const isNight = timeBucket === 'night';

  return (
    <>
    <ConfettiOverlay visible={showConfetti} onDone={dismissConfetti} />
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 72,
          borderRadius: 28,
          backgroundColor: isNight
            ? 'rgba(16, 14, 30, 0.88)'
            : 'rgba(255, 255, 255, 0.82)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: isNight
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.5)',
          paddingBottom: 0,
          paddingTop: 0,
          ...Platform.select({
            ios: {
              shadowColor: isNight ? '#000' : '#1A2030',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isNight ? 0.4 : 0.14,
              shadowRadius: 28,
            },
            android: { elevation: 12 },
            web: {
              boxShadow: isNight
                ? '0 10px 40px rgba(0,0,0,0.4)'
                : '0 10px 40px rgba(26,32,48,0.14)',
            } as any,
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontFamily: typography.family.medium,
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Сегодня',
          tabBarIcon: ({ color, focused }) => (
            <View style={[focused ? styles.activeIcon : undefined, styles.iconWrap]}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
              {focused && <View style={[styles.glowDot, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="walk"
        options={{
          title: 'Прогулка',
          tabBarIcon: ({ color, focused }) => (
            <View style={[focused ? styles.activeIcon : undefined, styles.iconWrap]}>
              <Ionicons name={focused ? 'footsteps' : 'footsteps-outline'} size={22} color={color} />
              {focused && <View style={[styles.glowDot, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Привычки',
          tabBarIcon: ({ color, focused }) => (
            <View style={[focused ? styles.activeIcon : undefined, styles.iconWrap]}>
              <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={22} color={color} />
              {focused && <View style={[styles.glowDot, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Сон',
          tabBarIcon: ({ color, focused }) => (
            <View style={[focused ? styles.activeIcon : undefined, styles.iconWrap]}>
              <Ionicons name={focused ? 'moon' : 'moon-outline'} size={22} color={color} />
              {focused && <View style={[styles.glowDot, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: 'Архив',
          tabBarIcon: ({ color, focused }) => (
            <View style={[focused ? styles.activeIcon : undefined, styles.iconWrap]}>
              <Ionicons name={focused ? 'albums' : 'albums-outline'} size={22} color={color} />
              {focused && <View style={[styles.glowDot, { backgroundColor: colors.tabBarActive, shadowColor: colors.tabBarActive }]} />}
            </View>
          ),
        }}
      />
    </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  glowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
});
