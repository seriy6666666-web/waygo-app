import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

let SQLite: typeof import('expo-sqlite') | null = null;
let db: any = null;

async function loadSQLite() {
  if (!SQLite) {
    SQLite = await import('expo-sqlite');
  }
  return SQLite;
}

export async function getDB() {
  if (isWeb) return null;
  if (!db) {
    const sql = await loadSQLite();
    db = await sql.openDatabaseAsync('waygo.db');
    await initTables(db);
  }
  return db;
}

async function initTables(database: any) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS walks (
      id TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_sec INTEGER,
      distance_m REAL,
      steps INTEGER,
      calories REAL,
      route TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS moods (
      id TEXT PRIMARY KEY,
      mood TEXT NOT NULL,
      note TEXT,
      photo_uri TEXT,
      created_at TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS day_cards (
      id TEXT PRIMARY KEY,
      date TEXT UNIQUE NOT NULL,
      walk_ids TEXT,
      mood_ids TEXT,
      tags TEXT,
      weather_code INTEGER,
      city TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS weekly_recaps (
      id TEXT PRIMARY KEY,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      total_walks INTEGER,
      total_distance_m REAL,
      total_duration_sec INTEGER,
      streak_days INTEGER,
      mood_summary TEXT,
      highlight_note TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (habit_id) REFERENCES habits(id)
    );

    CREATE TABLE IF NOT EXISTS sleep_entries (
      id TEXT PRIMARY KEY,
      date TEXT UNIQUE NOT NULL,
      bed_time TEXT NOT NULL,
      wake_time TEXT NOT NULL,
      quality TEXT NOT NULL,
      duration_min INTEGER,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS achievements_unlocked (
      achievement_id TEXT PRIMARY KEY,
      unlocked_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

// --- Walk helpers ---
export async function insertWalk(walk: {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSec: number;
  distanceM: number;
  steps: number;
  calories: number;
  route: string;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO walks (id, started_at, ended_at, duration_sec, distance_m, steps, calories, route)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [walk.id, walk.startedAt, walk.endedAt, walk.durationSec, walk.distanceM, walk.steps, walk.calories, walk.route]
  );
}

export async function getWalksByDate(date: string) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM walks WHERE date(started_at) = ? ORDER BY started_at DESC`,
    [date]
  );
}

export async function getAllWalkRoutes(): Promise<{ route: string }[]> {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT route FROM walks WHERE ended_at IS NOT NULL AND route IS NOT NULL`
  ) as Promise<{ route: string }[]>;
}

// --- Mood helpers ---
export async function insertMood(mood: {
  id: string;
  mood: string;
  note: string | null;
  photoUri: string | null;
  createdAt: string;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO moods (id, mood, note, photo_uri, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [mood.id, mood.mood, mood.note, mood.photoUri, mood.createdAt]
  );
}

export async function getMoodsByDate(date: string) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM moods WHERE date(created_at) = ? ORDER BY created_at DESC`,
    [date]
  );
}

// --- Day Card helpers ---
export async function upsertDayCard(card: {
  id: string;
  date: string;
  walkIds: string[];
  moodIds: string[];
  tags: string[];
  weatherCode: number | null;
  city: string | null;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO day_cards (id, date, walk_ids, mood_ids, tags, weather_code, city)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [card.id, card.date, JSON.stringify(card.walkIds), JSON.stringify(card.moodIds), JSON.stringify(card.tags), card.weatherCode, card.city]
  );
}

export async function getDayCardByDate(date: string) {
  if (isWeb) return null;
  const database = await getDB();
  return (database.getFirstAsync as Function)(
    `SELECT * FROM day_cards WHERE date = ?`,
    [date]
  ) as Promise<any>;
}

export async function getRecentDayCards(limit = 30) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM day_cards ORDER BY date DESC LIMIT ?`,
    [limit]
  );
}

// --- Weekly Recap helpers ---
export async function upsertWeeklyRecap(recap: {
  id: string;
  weekStart: string;
  weekEnd: string;
  totalWalks: number;
  totalDistanceM: number;
  totalDurationSec: number;
  streakDays: number;
  moodSummary: Record<string, number>;
  highlightNote: string | null;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO weekly_recaps (id, week_start, week_end, total_walks, total_distance_m, total_duration_sec, streak_days, mood_summary, highlight_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [recap.id, recap.weekStart, recap.weekEnd, recap.totalWalks, recap.totalDistanceM, recap.totalDurationSec, recap.streakDays, JSON.stringify(recap.moodSummary), recap.highlightNote]
  );
}

export async function getWeeklyRecaps(limit = 20) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM weekly_recaps ORDER BY week_start DESC LIMIT ?`,
    [limit]
  );
}

export async function getWalksBetween(startDate: string, endDate: string) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM walks WHERE date(started_at) >= ? AND date(started_at) <= ? AND ended_at IS NOT NULL ORDER BY started_at`,
    [startDate, endDate]
  );
}

export async function getMoodsBetween(startDate: string, endDate: string) {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT * FROM moods WHERE date(created_at) >= ? AND date(created_at) <= ? ORDER BY created_at`,
    [startDate, endDate]
  );
}

// --- Sleep helpers ---
export async function insertSleep(entry: {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  quality: string;
  durationMin: number;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO sleep_entries (id, date, bed_time, wake_time, quality, duration_min)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [entry.id, entry.date, entry.bedTime, entry.wakeTime, entry.quality, entry.durationMin]
  );
}

// --- Habit helpers ---
export async function insertHabit(habit: {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
}) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO habits (id, name, icon, color, created_at) VALUES (?, ?, ?, ?, ?)`,
    [habit.id, habit.name, habit.icon, habit.color, habit.createdAt]
  );
}

export async function toggleHabitLog(habitId: string, date: string, done: boolean) {
  if (isWeb) return;
  const database = await getDB();
  const id = `${habitId}_${date}`;
  await database.runAsync(
    `INSERT OR REPLACE INTO habit_logs (id, habit_id, date, done) VALUES (?, ?, ?, ?)`,
    [id, habitId, date, done ? 1 : 0]
  );
}

export async function getHabitLogsBetween(startDate: string, endDate: string): Promise<any[]> {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(
    `SELECT date, COUNT(*) as count FROM habit_logs WHERE date >= ? AND date <= ? AND done = 1 GROUP BY date`,
    [startDate, endDate]
  );
}

// --- Settings helpers ---
export async function getSetting(key: string): Promise<string | null> {
  if (isWeb) return null;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT value FROM settings WHERE key = ?`,
    [key]
  ) as { value: string } | null;
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
    [key, value]
  );
}

// --- Achievement helpers ---
export async function getUnlockedAchievements(): Promise<{ achievement_id: string; unlocked_at: string }[]> {
  if (isWeb) return [];
  const database = await getDB();
  return database.getAllAsync(`SELECT * FROM achievements_unlocked ORDER BY unlocked_at DESC`);
}

export async function unlockAchievement(achievementId: string, unlockedAt: string) {
  if (isWeb) return;
  const database = await getDB();
  await database.runAsync(
    `INSERT OR IGNORE INTO achievements_unlocked (achievement_id, unlocked_at) VALUES (?, ?)`,
    [achievementId, unlockedAt]
  );
}

export async function getWalksCount(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COUNT(*) as cnt FROM walks WHERE ended_at IS NOT NULL`
  ) as { cnt: number } | null;
  return row?.cnt ?? 0;
}

export async function getTotalDistanceM(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COALESCE(SUM(distance_m), 0) as total FROM walks WHERE ended_at IS NOT NULL`
  ) as { total: number } | null;
  return row?.total ?? 0;
}

export async function getMoodsCount(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COUNT(*) as cnt FROM moods`
  ) as { cnt: number } | null;
  return row?.cnt ?? 0;
}

export async function getSleepCount(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COUNT(*) as cnt FROM sleep_entries`
  ) as { cnt: number } | null;
  return row?.cnt ?? 0;
}

export async function getHabitsCount(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COUNT(*) as cnt FROM habits`
  ) as { cnt: number } | null;
  return row?.cnt ?? 0;
}

// --- Streak & WeekDay helpers ---

/** Count consecutive days (from today backward) that have at least one walk */
export async function getStreakDays(): Promise<number> {
  if (isWeb) return 0;
  const database = await getDB();
  const rows = await database.getAllAsync(
    `SELECT DISTINCT date(started_at) as d FROM walks WHERE ended_at IS NOT NULL ORDER BY d DESC`
  ) as { d: string }[];
  if (rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; ; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    if (rows.some((r) => r.d === dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Get walk status for each day of the current week (Mon-Sun) */
export async function getWeekWalkDays(): Promise<('full' | 'half' | 'empty')[]> {
  if (isWeb) return Array(7).fill('empty');
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const start = monday.toISOString().split('T')[0];
  const end = sunday.toISOString().split('T')[0];

  const database = await getDB();
  const rows = await database.getAllAsync(
    `SELECT date(started_at) as d, COUNT(*) as cnt FROM walks WHERE ended_at IS NOT NULL AND date(started_at) >= ? AND date(started_at) <= ? GROUP BY d`,
    [start, end]
  ) as { d: string; cnt: number }[];

  const result: ('full' | 'half' | 'empty')[] = [];
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(monday);
    checkDate.setDate(monday.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const match = rows.find((r) => r.d === dateStr);
    if (!match) result.push('empty');
    else if (match.cnt >= 2) result.push('full');
    else result.push('half');
  }
  return result;
}

/** Count walks this week */
export async function getWeekWalksCount(): Promise<number> {
  if (isWeb) return 0;
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const start = monday.toISOString().split('T')[0];
  const end = sunday.toISOString().split('T')[0];

  const database = await getDB();
  const row = await (database.getFirstAsync as Function)(
    `SELECT COUNT(*) as cnt FROM walks WHERE ended_at IS NOT NULL AND date(started_at) >= ? AND date(started_at) <= ?`,
    [start, end]
  ) as { cnt: number } | null;
  return row?.cnt ?? 0;
}
