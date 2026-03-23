import type { DayCard, MoodKey, WeeklyRecap } from '../types';
import { generateId, getTodayDate, getWeekRange } from '../utils/date';
import {
    getDayCardByDate,
    getMoodsBetween,
    getMoodsByDate,
    getRecentDayCards,
    getWalksBetween,
    getWalksByDate,
    getWeeklyRecaps,
    upsertDayCard,
    upsertWeeklyRecap,
} from './database';

// --- Day Card generation ---

export async function generateTodayDayCard(weatherCode: number | null = null): Promise<DayCard | null> {
  const date = getTodayDate();
  const [walks, moods] = await Promise.all([
    getWalksByDate(date),
    getMoodsByDate(date),
  ]);

  if ((walks as any[]).length === 0 && (moods as any[]).length === 0) return null;

  const walkIds = (walks as any[]).map((w: any) => w.id);
  const moodIds = (moods as any[]).map((m: any) => m.id);

  // auto-generate tags from time of day + weather
  const tags: string[] = [];
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) tags.push('Утро');
  else if (hour >= 11 && hour < 17) tags.push('День');
  else if (hour >= 17 && hour < 22) tags.push('Вечер');
  else tags.push('Ночь');

  if (weatherCode !== null) {
    if (weatherCode <= 1) tags.push('Ясно');
    else if (weatherCode <= 48) tags.push('Облачно');
    else if (weatherCode <= 82 || weatherCode === 95) tags.push('Дождь');
    else tags.push('Снег');
  }

  const existing = await getDayCardByDate(date);
  const id = existing?.id ?? generateId();

  const card: DayCard = {
    id,
    date,
    walkIds,
    moodIds,
    tags,
    weatherCode,
    city: null,
    synced: false,
  };

  await upsertDayCard(card);
  return card;
}

export async function loadRecentCards(): Promise<DayCard[]> {
  const rows = await getRecentDayCards(30);
  return (rows as any[]).map((r: any) => ({
    id: r.id,
    date: r.date,
    walkIds: safeParse(r.walk_ids, []),
    moodIds: safeParse(r.mood_ids, []),
    tags: safeParse(r.tags, []),
    weatherCode: r.weather_code,
    city: r.city,
    synced: !!r.synced,
  }));
}

// --- Weekly Recap generation ---

export async function generateCurrentWeekRecap(): Promise<WeeklyRecap | null> {
  const { start, end } = getWeekRange();
  const [walks, moods] = await Promise.all([
    getWalksBetween(start, end),
    getMoodsBetween(start, end),
  ]);

  const walksArr = walks as any[];
  const moodsArr = moods as any[];

  if (walksArr.length === 0 && moodsArr.length === 0) return null;

  const totalWalks = walksArr.length;
  const totalDistanceM = walksArr.reduce((s: number, w: any) => s + (w.distance_m ?? 0), 0);
  const totalDurationSec = walksArr.reduce((s: number, w: any) => s + (w.duration_sec ?? 0), 0);

  // mood summary
  const moodSummary: Partial<Record<MoodKey, number>> = {};
  for (const m of moodsArr) {
    const key = m.mood as MoodKey;
    moodSummary[key] = (moodSummary[key] ?? 0) + 1;
  }

  // Streak: count consecutive days with walks from end of week backward
  const walkDays = new Set(walksArr.map((w: any) => w.started_at?.split('T')[0]));
  let streakDays = 0;
  const endDate = new Date(end);
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(endDate);
    checkDate.setDate(endDate.getDate() - i);
    const ds = checkDate.toISOString().split('T')[0];
    if (walkDays.has(ds)) streakDays++;
    else break;
  }

  // highlight: first mood note of the week
  const highlighted = moodsArr.find((m: any) => m.note);
  const highlightNote = highlighted?.note ?? null;

  const id = `recap_${start}`;

  const recap: WeeklyRecap = {
    id,
    weekStart: start,
    weekEnd: end,
    totalWalks,
    totalDistanceM,
    totalDurationSec,
    streakDays,
    moodSummary,
    highlightNote,
    synced: false,
  };

  await upsertWeeklyRecap({
    ...recap,
    moodSummary: moodSummary as Record<string, number>,
  });

  return recap;
}

export async function loadRecaps(): Promise<WeeklyRecap[]> {
  const rows = await getWeeklyRecaps(20);
  return (rows as any[]).map((r: any) => ({
    id: r.id,
    weekStart: r.week_start,
    weekEnd: r.week_end,
    totalWalks: r.total_walks,
    totalDistanceM: r.total_distance_m,
    totalDurationSec: r.total_duration_sec,
    streakDays: r.streak_days,
    moodSummary: safeParse(r.mood_summary, {}),
    highlightNote: r.highlight_note,
    synced: !!r.synced,
  }));
}

function safeParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
