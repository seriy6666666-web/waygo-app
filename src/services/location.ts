import * as Location from 'expo-location';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  try {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return { lat: loc.coords.latitude, lng: loc.coords.longitude };
  } catch {
    return null;
  }
}

export async function startLocationTracking(
  onUpdate: (lat: number, lng: number) => void,
): Promise<{ remove: () => void } | null> {
  try {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      (loc) => {
        onUpdate(loc.coords.latitude, loc.coords.longitude);
      },
    );
    return { remove: () => sub.remove() };
  } catch (e) {
    console.warn('Location tracking failed:', e);
    return null;
  }
}
