import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const BACKGROUND_LOCATION_TASK = 'waygo-background-location';

// Background location handler — receives location updates when app is in background
let bgCallback: ((lat: number, lng: number) => void) | null = null;

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.warn('Background location error:', error);
    return;
  }
  if (data?.locations?.length && bgCallback) {
    const loc = data.locations[data.locations.length - 1];
    bgCallback(loc.coords.latitude, loc.coords.longitude);
  }
});

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function requestBackgroundPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  try {
    const loc = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Location timeout')), 5000),
      ),
    ]);
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

export async function startBackgroundTracking(
  onUpdate: (lat: number, lng: number) => void,
): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const hasBg = await requestBackgroundPermission();
    if (!hasBg) return false;

    bgCallback = onUpdate;

    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK).catch(() => false);
    if (isRunning) return true;

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
      deferredUpdatesInterval: 5000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Waygo',
        notificationBody: 'Tracking your walk...',
        notificationColor: '#6FAEA5',
      },
    });
    return true;
  } catch (e) {
    console.warn('Background tracking failed:', e);
    return false;
  }
}

export async function stopBackgroundTracking() {
  bgCallback = null;
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK).catch(() => false);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  } catch (e) {
    console.warn('Stop background tracking failed:', e);
  }
}
