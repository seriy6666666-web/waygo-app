import type { RoutePoint } from '../types';

export function calculateDistance(route: RoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total += haversine(
      route[i - 1].lat, route[i - 1].lng,
      route[i].lat, route[i].lng,
    );
  }
  return total; // meters
}

export function calculateCalories(distanceKm: number, weightKg: number = 70): number {
  return Math.round(weightKg * distanceKm * 0.75);
}

export function calculateSpeed(distanceM: number, durationSec: number): number {
  if (durationSec === 0) return 0;
  return (distanceM / 1000) / (durationSec / 3600);
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
