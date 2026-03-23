// ============================================
// Waygo — Core Types
// ============================================

// --- Mood ---
export type MoodKey = 'calm' | 'light' | 'focused' | 'tired' | 'inspired' | 'reflective';

export const MOOD_LABELS: Record<MoodKey, { ru: string; en: string; emoji: string }> = {
  calm: { ru: 'Спокойно', en: 'Calm', emoji: '😌' },
  light: { ru: 'Легко', en: 'Light', emoji: '😊' },
  focused: { ru: 'Сфокусировано', en: 'Focused', emoji: '🎯' },
  tired: { ru: 'Уставше', en: 'Tired', emoji: '😴' },
  inspired: { ru: 'Вдохновлённо', en: 'Inspired', emoji: '✨' },
  reflective: { ru: 'Рефлексивно', en: 'Reflective', emoji: '🌙' },
};

// --- Walk ---
export interface RoutePoint {
  lat: number;
  lng: number;
  ts: number; // unix timestamp ms
}

export interface Walk {
  id: string;
  startedAt: string;   // ISO timestamp
  endedAt: string | null;
  durationSec: number;
  distanceM: number;
  steps: number;
  calories: number;
  route: RoutePoint[];
  synced: boolean;
}

// --- Mood Entry ---
export interface MoodEntry {
  id: string;
  mood: MoodKey;
  note: string | null;
  photoUri: string | null;
  createdAt: string; // ISO timestamp
  synced: boolean;
}

// --- Day Card ---
export interface DayCard {
  id: string;
  date: string;          // YYYY-MM-DD
  walkIds: string[];
  moodIds: string[];
  tags: string[];
  weatherCode: number | null;
  city: string | null;
  synced: boolean;
}

// --- Weekly Recap ---
export interface WeeklyRecap {
  id: string;
  weekStart: string;     // YYYY-MM-DD (Monday)
  weekEnd: string;
  totalWalks: number;
  totalDistanceM: number;
  totalDurationSec: number;
  streakDays: number;
  moodSummary: Partial<Record<MoodKey, number>>;
  highlightNote: string | null;
  synced: boolean;
}

// --- Weather ---
export type WeatherBucket = 'clear' | 'cloudy' | 'rain' | 'snowFog';
export type TimeBucket = 'morning' | 'day' | 'evening' | 'night';

export interface WeatherData {
  code: number;
  bucket: WeatherBucket;
  temperature: number;
}

// --- Theme ---
export interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  // Surfaces
  surfaceCard: string;
  surfaceCardAlt: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  // Accents
  accent: string;
  accentBright: string;
  accentMuted: string;
  // Semantic accents
  accentMood: string;
  accentRhythm: string;
  accentMemory: string;
  // Stroke
  stroke: string;
  // Tab bar
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  // StatusBar
  statusBarStyle: 'light-content' | 'dark-content';
  // Meta
  greeting: string;
  greetingEmoji: string;
  tipStyle: 'motivating' | 'energetic' | 'relaxing' | 'calm';
}

// --- Settings ---
export interface UserSettings {
  name: string;
  weeklyGoal: number;       // 3, 5, or 7
  adaptiveAmbiance: boolean;
  locale: 'ru' | 'en';
  freezesLeft: number;      // streak freezes remaining this month
  frozenDates: string[];    // YYYY-MM-DD array of frozen dates
}

// --- Habits ---
export type HabitIcon = 'water' | 'meditation' | 'reading' | 'stretching' | 'no-phone' | 'gratitude' | 'custom';

export interface Habit {
  id: string;
  name: string;
  icon: HabitIcon;
  color: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  done: boolean;
}

// --- Sleep ---
export type SleepQuality = 'great' | 'ok' | 'meh' | 'bad';

export interface SleepEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  bedTime: string;       // HH:mm
  wakeTime: string;      // HH:mm
  quality: SleepQuality;
  durationMin: number;
  synced: boolean;
}

// --- Achievements ---
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementCategory = 'move' | 'mood' | 'rhythm' | 'memory' | 'explore' | 'sleep';

export interface Achievement {
  id: string;
  key: string;
  category: AchievementCategory;
  tier: AchievementTier;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  icon: string;
  condition: string; // machine-readable condition key
  premium: boolean;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string; // ISO timestamp
}

// --- Challenges ---
export type ChallengeType = 'walk_count' | 'walk_distance' | 'mood_streak' | 'habit_streak' | 'sleep_streak';

export interface Challenge {
  id: string;
  type: ChallengeType;
  titleRu: string;
  titleEn: string;
  target: number;
  current: number;
  icon: string;
  startDate: string;  // YYYY-MM-DD (Monday)
  endDate: string;    // YYYY-MM-DD (Sunday)
  completed: boolean;
}

// --- Navigation ---
export type TabName = 'home' | 'walk' | 'archive';
