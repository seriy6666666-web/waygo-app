// Google Maps custom styles for Waygo
// Soft, minimal style that adapts to time of day

export const MAP_STYLE_LIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#f0faf7' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b8f85' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f0faf7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e4f4ee' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#c8e8de' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dceee6' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfd7e6' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6b8f85' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dcf0e8' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b8f85' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4edde' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c8e8de' }] },
];

export const MAP_STYLE_EVENING = [
  { elementType: 'geometry', stylers: [{ color: '#f5e8ea' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9b6b72' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fff5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffe4e6' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#f5d0d5' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffd6da' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0c8d0' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#ffe0e3' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#f0dde0' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export const MAP_STYLE_DARK = [
  { elementType: 'geometry', stylers: [{ color: '#0c0b14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b7fa0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#12101f' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1830' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#252240' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#201d38' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#2a2650' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#141228' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6b5f80' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#141220' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b5f80' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#161428' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#252240' }] },
];

export const MAP_STYLE_MORNING = [
  { elementType: 'geometry', stylers: [{ color: '#fff8f0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a08060' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fff8f0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fff0e0' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#f5e0c8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffe8cc' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e8dcd0' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#ffedd5' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#f5e8d0' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
