import { getWeatherBucket } from '../theme/adaptive';
import type { WeatherData } from '../types';

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=weather_code,temperature_2m`;
    const res = await fetch(url);
    const data = await res.json();

    const code = data.current.weather_code as number;
    const temperature = data.current.temperature_2m as number;

    return {
      code,
      bucket: getWeatherBucket(code),
      temperature,
    };
  } catch (e) {
    console.warn('Weather fetch failed:', e);
    return null;
  }
}
