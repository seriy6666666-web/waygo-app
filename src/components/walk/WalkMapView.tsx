import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import type { RoutePoint } from '../../types';
import { OSMMapView } from '../ui/OSMMapView';

interface Props {
  route: RoutePoint[];
  isLive?: boolean;
  style?: object;
}

export function WalkMapView({ route, isLive = false, style }: Props) {
  const colors = useThemeStore((s) => s.colors);

  const coords = route.map((p) => ({ latitude: p.lat, longitude: p.lng }));
  const lastPoint = coords[coords.length - 1];

  const region = coords.length > 0
    ? (isLive && lastPoint
        ? { ...lastPoint, latitudeDelta: 0.005, longitudeDelta: 0.005 }
        : getRegion(coords))
    : { latitude: 55.75, longitude: 37.62, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  const polylines = useMemo(() => {
    if (coords.length < 2) return [];
    return [{ coordinates: coords, color: colors.accent, width: 4 }];
  }, [coords, colors.accent]);

  return (
    <View style={[styles.container, style]}>
      {coords.length === 0 && !isLive ? (
        <View style={[styles.map, { backgroundColor: colors.surfaceCard, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>No route data</Text>
        </View>
      ) : (
        <OSMMapView
          region={region}
          polylines={polylines}
          showUserLocation={isLive}
          scrollEnabled={!isLive}
          zoomEnabled={!isLive}
          accentColor={colors.accent}
          style={styles.map}
        />
      )}
    </View>
  );
}

function getRegion(coords: { latitude: number; longitude: number }[]) {
  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLng = coords[0].longitude;
  let maxLng = coords[0].longitude;

  for (const c of coords) {
    if (c.latitude < minLat) minLat = c.latitude;
    if (c.latitude > maxLat) maxLat = c.latitude;
    if (c.longitude < minLng) minLng = c.longitude;
    if (c.longitude > maxLng) maxLng = c.longitude;
  }

  const latDelta = Math.max((maxLat - minLat) * 1.4, 0.005);
  const lngDelta = Math.max((maxLng - minLng) * 1.4, 0.005);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
