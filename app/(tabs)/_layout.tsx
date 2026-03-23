import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { typography } from '../../src/theme/tokens';

export default function TabLayout() {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);
  const isNight = timeBucket === 'night';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 20,
          right: 20,
          height: 68,
          borderRadius: 24,
          backgroundColor: isNight
            ? 'rgba(16, 14, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.78)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: isNight
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.5)',
          paddingBottom: 0,
          paddingTop: 0,
          ...Platform.select({
            ios: {
              shadowColor: isNight ? '#000' : '#64748B',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isNight ? 0.4 : 0.12,
              shadowRadius: 24,
            },
            android: { elevation: 8 },
            web: {
              boxShadow: isNight
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(100,116,139,0.12)',
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
            <View style={focused ? styles.activeIcon : undefined}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="walk"
        options={{
          title: 'Прогулка',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : undefined}>
              <Ionicons name={focused ? 'footsteps' : 'footsteps-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Привычки',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : undefined}>
              <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Сон',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : undefined}>
              <Ionicons name={focused ? 'moon' : 'moon-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: 'Архив',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : undefined}>
              <Ionicons name={focused ? 'albums' : 'albums-outline'} size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
});
