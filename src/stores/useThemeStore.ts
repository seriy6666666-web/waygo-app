import { create } from 'zustand';
import { getAdaptiveTheme, getTimeBucket, getWeatherBucket } from '../theme/adaptive';
import { getDefaultTheme } from '../theme/themes';
import type { ThemeColors, TimeBucket, WeatherData } from '../types';

interface ThemeState {
  colors: ThemeColors;
  timeBucket: TimeBucket;
  weather: WeatherData | null;
  setWeather: (data: WeatherData) => void;
  updateTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colors: getDefaultTheme(),
  timeBucket: getTimeBucket(new Date().getHours()),
  weather: null,

  setWeather: (data) => {
    set({ weather: data });
    get().updateTheme();
  },

  updateTheme: () => {
    const time = getTimeBucket(new Date().getHours());
    const weather = get().weather;
    const weatherBucket = weather ? getWeatherBucket(weather.code) : 'clear';
    const colors = getAdaptiveTheme(time, weatherBucket);
    set({ colors, timeBucket: time });
  },
}));
