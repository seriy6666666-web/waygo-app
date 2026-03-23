// ============================================
// Waygo — Adaptive Ambiance Logic
// Dynamic wallpaper style: time-of-day + weather + mood
// ============================================

import type { MoodKey, ThemeColors, TimeBucket, WeatherBucket } from '../types';
import { timeThemes } from './themes';

export function getTimeBucket(hour: number): TimeBucket {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function getWeatherBucket(code: number): WeatherBucket {
  if (code <= 1) return 'clear';
  if ([2, 3, 45, 48].includes(code)) return 'cloudy';
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82) || code === 95) return 'rain';
  return 'snowFog';
}

// Weather slightly modifies the base time theme
export function applyWeatherModifier(
  theme: ThemeColors,
  weather: WeatherBucket,
): ThemeColors {
  switch (weather) {
    case 'cloudy':
      // Slightly desaturated, cooler
      return { ...theme, accentMuted: theme.textSecondary };
    case 'rain':
      // Muted, slightly blue-shifted feel
      return { ...theme, accentMuted: theme.textSecondary };
    case 'snowFog':
      // Cooler, slightly washed out
      return { ...theme, accentMuted: theme.textSecondary };
    default:
      return theme;
  }
}

export function getAdaptiveTheme(
  time: TimeBucket,
  weather: WeatherBucket,
): ThemeColors {
  const base = timeThemes[time];
  return applyWeatherModifier(base, weather);
}

// Mood overlay modifiers (subtle tint on top of theme)
export function getMoodOverlay(mood: MoodKey | null): {
  overlayColor: string | null;
  overlayOpacity: number;
} {
  switch (mood) {
    case 'calm':
      return { overlayColor: '#BFD7E6', overlayOpacity: 0.04 };
    case 'light':
    case 'inspired':
      return { overlayColor: '#FDE68A', overlayOpacity: 0.05 };
    case 'tired':
      return { overlayColor: '#94A3B8', overlayOpacity: 0.04 };
    case 'reflective':
      return { overlayColor: '#C4B5FD', overlayOpacity: 0.04 };
    default:
      return { overlayColor: null, overlayOpacity: 0 };
  }
}

// Time-based tips
export function getTimeTips(time: TimeBucket, isRu: boolean): string[] {
  const tips: Record<TimeBucket, { ru: string[]; en: string[] }> = {
    morning: {
      ru: [
        'Начни день с короткой прогулки ☀️',
        'Свежий воздух утром заряжает на весь день',
        'Сделай пару глубоких вдохов на улице',
      ],
      en: [
        'Start your day with a short walk ☀️',
        'Fresh morning air energizes your whole day',
        'Take a few deep breaths outside',
      ],
    },
    day: {
      ru: [
        'Отличное время для прогулки!',
        'Попробуй новый маршрут через парк',
        'Сделай перерыв — 15 минут на воздухе',
      ],
      en: [
        'Great time for a walk!',
        'Try a new route through the park',
        'Take a break — 15 minutes outside',
      ],
    },
    evening: {
      ru: [
        'Запиши, за что благодарен сегодня 🌇',
        'Вечерняя прогулка — лучший способ расслабиться',
        'Как прошёл твой день? Отметь настроение',
      ],
      en: [
        'Write down what you\'re grateful for today 🌇',
        'An evening walk is the best way to unwind',
        'How was your day? Log your mood',
      ],
    },
    night: {
      ru: [
        'Спокойной ночи 🌙 Завтра будет новый день',
        'Отложи телефон и дай себе отдохнуть',
        'Запиши свой сон, когда проснёшься',
      ],
      en: [
        'Good night 🌙 Tomorrow is a new day',
        'Put the phone down and rest',
        'Log your sleep when you wake up',
      ],
    },
  };
  const list = isRu ? tips[time].ru : tips[time].en;
  return list;
}

// Greeting by time of day
export function getGreeting(time: TimeBucket, name: string, isRu: boolean): string {
  const greetings: Record<TimeBucket, { ru: string; en: string }> = {
    morning: { ru: `Доброе утро, ${name}`, en: `Good morning, ${name}` },
    day: { ru: `Добрый день, ${name}`, en: `Good afternoon, ${name}` },
    evening: { ru: `Добрый вечер, ${name}`, en: `Good evening, ${name}` },
    night: { ru: `Спокойной ночи, ${name}`, en: `Good night, ${name}` },
  };
  return isRu ? greetings[time].ru : greetings[time].en;
}
