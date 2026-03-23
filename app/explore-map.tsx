import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { getAllWalkRoutes } from '../src/services/database';
import { useThemeStore } from '../src/stores/useThemeStore';
import { spacing, typography } from '../src/theme/tokens';
import type { RoutePoint } from '../src/types';

let MapView: any = null;
let Circle: any = null;
let PolylineComp: any = null;
let PROVIDER_GOOGLE: any = null;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Circle = maps.Circle;
  PolylineComp = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

export default function ExploreMapScreen() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const colors = useThemeStore((s) => s.colors);
  const isRu = i18n.language === 'ru';

  const [routes, setRoutes] = useState<RoutePoint[][]>([]);
  const [stats, setStats] = useState({ totalRoutes: 0, totalPoints: 0 });

  useEffect(() => {
    (async () => {
      const rows = await getAllWalkRoutes();
      const parsed: RoutePoint[][] = [];
      let totalPts = 0;
      for (const row of rows) {
        try {
          const pts: RoutePoint[] = JSON.parse(row.route);
          if (pts.length >= 2) {
            parsed.push(pts);
            totalPts += pts.length;
          }
        } catch {}
      }
      setRoutes(parsed);
      setStats({ totalRoutes: parsed.length, totalPoints: totalPts });
    })();
  }, []);

  // Compute center from all routes
  const allPoints = routes.flat();
  const center = allPoints.length > 0
    ? {
        latitude: allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length,
        longitude: allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : { latitude: 55.75, longitude: 37.62, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  return (
    <SafeArea>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.surfaceCardAlt }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>
          {isRu ? 'Карта открытий' : 'Explore Map'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' || !MapView ? (
          <View style={[styles.map, { backgroundColor: colors.surfaceCard, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Map (native only)</Text>
          </View>
        ) : (
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={center}
          showsUserLocation
          showsMyLocationButton={false}
          loadingEnabled
          loadingBackgroundColor={colors.bgPrimary}
        >
          {/* Fog of War: reveal circles along each route */}
          {routes.map((route, rIdx) =>
            route
              .filter((_, i) => i % 3 === 0)
              .map((pt, pIdx) => (
                <Circle
                  key={`${rIdx}-${pIdx}`}
                  center={{ latitude: pt.lat, longitude: pt.lng }}
                  radius={50}
                  strokeWidth={0}
                  fillColor={colors.accent + '18'}
                />
              ))
          )}

          {/* Route polylines */}
          {routes.map((route, idx) => (
            <PolylineComp
              key={`route-${idx}`}
              coordinates={route.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
              strokeColor={colors.accent}
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </MapView>
        )}

        {/* Stats overlay */}
        <View style={[styles.statsOverlay, { backgroundColor: colors.surfaceCard + 'E0' }]}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: colors.accent, fontFamily: typography.family.bold }]}>
              {stats.totalRoutes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {isRu ? 'маршрутов' : 'routes'}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.stroke }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: colors.accent, fontFamily: typography.family.bold }]}>
              {stats.totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>
              {isRu ? 'точек' : 'points'}
            </Text>
          </View>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.h3,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  statCol: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: typography.size.caption,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    opacity: 0.3,
  },
});
