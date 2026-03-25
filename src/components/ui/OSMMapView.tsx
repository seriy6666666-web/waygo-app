import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Polyline {
  coordinates: LatLng[];
  color?: string;
  width?: number;
}

interface Circle {
  center: LatLng;
  radius: number;
  fillColor?: string;
}

interface Props {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  polylines?: Polyline[];
  circles?: Circle[];
  showUserLocation?: boolean;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  style?: object;
  accentColor?: string;
}

export function OSMMapView({
  region,
  polylines = [],
  circles = [],
  showUserLocation = false,
  scrollEnabled = true,
  zoomEnabled = true,
  style,
  accentColor = '#6FAEA5',
}: Props) {
  const zoom = useMemo(() => {
    const delta = Math.max(region.latitudeDelta, region.longitudeDelta);
    if (delta > 0.1) return 12;
    if (delta > 0.05) return 13;
    if (delta > 0.01) return 14;
    if (delta > 0.005) return 16;
    return 17;
  }, [region.latitudeDelta, region.longitudeDelta]);

  const html = useMemo(() => {
    const polylinesJS = polylines
      .map((pl) => {
        const coords = pl.coordinates.map((c) => `[${c.latitude}, ${c.longitude}]`).join(',');
        return `L.polyline([${coords}], {color:'${pl.color || accentColor}',weight:${pl.width || 4},lineCap:'round',lineJoin:'round'}).addTo(map);`;
      })
      .join('\n');

    const circlesJS = circles
      .map((c) => {
        return `L.circle([${c.center.latitude}, ${c.center.longitude}], {radius:${c.radius},stroke:false,fillColor:'${c.fillColor || accentColor}',fillOpacity:0.15}).addTo(map);`;
      })
      .join('\n');

    const userLocationJS = showUserLocation
      ? `
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          var userMarker = L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
            radius: 8, fillColor: '#4285F4', fillOpacity: 1, color: '#fff', weight: 3
          }).addTo(map);
        }, function() {}, {enableHighAccuracy: false, timeout: 5000});
      }`
      : '';

    const dragging = scrollEnabled ? '' : 'map.dragging.disable();';
    const zoomCtrl = zoomEnabled ? '' : 'map.touchZoom.disable();map.scrollWheelZoom.disable();map.doubleClickZoom.disable();map.boxZoom.disable();';

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%;}
  .leaflet-control-attribution{display:none!important;}
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([${region.latitude},${region.longitude}],${zoom});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  ${dragging}
  ${zoomCtrl}
  ${polylinesJS}
  ${circlesJS}
  ${userLocationJS}
</script>
</body>
</html>`;
  }, [region, polylines, circles, showUserLocation, scrollEnabled, zoomEnabled, accentColor, zoom]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
