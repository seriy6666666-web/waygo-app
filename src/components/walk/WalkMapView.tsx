import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MAP_STYLE_DARK, MAP_STYLE_EVENING, MAP_STYLE_LIGHT, MAP_STYLE_MORNING } from '../../constants/mapStyles';
import { useThemeStore } from '../../stores/useThemeStore';
import type { TimeBucket } from '../../types';
import type { RoutePoint } from '../../types';
import { MapErrorBoundary } from '../ui/MapErrorBoundary';

const MAP_STYLES: Record<TimeBucket, object[]> = {
  morning: MAP_STYLE_MORNING,
  day: MAP_STYLE_LIGHT,
  evening: MAP_STYLE_EVENING,
  night: MAP_STYLE_DARK,
};

let MapViewComponent: any = null;
let Polyline: any = null;
let PROVIDER_GOOGLE: any = null;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapViewComponent = maps.default;
  Polyline = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

interface Props {
  route: RoutePoint[];
  isLive?: boolean;
  style?: object;
}

export function WalkMapView({ route, isLive = false, style }: Props) {
  const colors = useThemeStore((s) => s.colors);
  const timeBucket = useThemeStore((s) => s.timeBucket);

  const coords = route.map((p) => ({ latitude: p.lat, longitude: p.lng }));
  const lastPoint = coords[coords.length - 1];

  // Calculate region to fit all points
  const region = coords.length > 0
    ? getRegion(coords)
    : { latitude: 55.75, longitude: 37.62, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'web' || !MapViewComponent ? (
        <View style={[styles.map, { backgroundColor: colors.surfaceCard, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Map (native only)</Text>
        </View>
      ) : (
      <MapErrorBoundary>
      <MapViewComponent
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={MAP_STYLES[timeBucket]}
        region={isLive && lastPoint ? { ...lastPoint, latitudeDelta: 0.005, longitudeDelta: 0.005 } : region}
        showsUserLocation={isLive}
        showsMyLocationButton={false}
        showsCompass={false}
        scrollEnabled={!isLive}
        zoomEnabled={!isLive}
        rotateEnabled={false}
        pitchEnabled={false}
        loadingEnabled
        loadingBackgroundColor={colors.bgPrimary}
      >
        {coords.length >= 2 && (
          <Polyline
            coordinates={coords}
            strokeColor={colors.accent}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapViewComponent>
      </MapErrorBoundary>
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
