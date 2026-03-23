import { create } from 'zustand';
import { ACHIEVEMENTS_CATALOG } from '../constants/achievements';
import {
    unlockAchievement as dbUnlock,
    getHabitsCount,
    getMoodsCount,
    getSleepCount,
    getTotalDistanceM,
    getUnlockedAchievements,
    getWalksCount,
} from '../services/database';
import type { UserAchievement } from '../types';
import { useToastStore } from './useToastStore';

interface AchievementState {
  unlocked: UserAchievement[];
  loading: boolean;
  loadUnlocked: () => Promise<void>;
  checkAndUnlock: (streakDays?: number, habitStreak?: number) => Promise<string[]>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlocked: [],
  loading: false,

  loadUnlocked: async () => {
    set({ loading: true });
    const rows = await getUnlockedAchievements();
    const unlocked: UserAchievement[] = rows.map((r) => ({
      achievementId: r.achievement_id,
      unlockedAt: r.unlocked_at,
    }));
    set({ unlocked, loading: false });
  },

  checkAndUnlock: async (streakDays = 0, habitStreak = 0) => {
    const [walksTotal, distanceTotal, moodsTotal, sleepTotal, habitsTotal] = await Promise.all([
      getWalksCount(),
      getTotalDistanceM(),
      getMoodsCount(),
      getSleepCount(),
      getHabitsCount(),
    ]);

    const stats: Record<string, number> = {
      walks_total: walksTotal,
      distance_total: distanceTotal,
      moods_total: moodsTotal,
      sleep_total: sleepTotal,
      habits_total: habitsTotal,
      streak: streakDays,
      habit_streak: habitStreak,
    };

    const alreadyUnlocked = new Set(get().unlocked.map((u) => u.achievementId));
    const newlyUnlocked: string[] = [];

    for (const ach of ACHIEVEMENTS_CATALOG) {
      if (alreadyUnlocked.has(ach.id)) continue;

      if (evaluateCondition(ach.condition, stats)) {
        const now = new Date().toISOString();
        await dbUnlock(ach.id, now);
        newlyUnlocked.push(ach.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      await get().loadUnlocked();

      // Show toast for each newly unlocked achievement
      const { show } = useToastStore.getState();
      for (const achId of newlyUnlocked) {
        const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === achId);
        if (ach) {
          const tier = ach.tier === 'bronze' ? '🥉' : ach.tier === 'silver' ? '🥈' : ach.tier === 'gold' ? '🥇' : '💎';
          show({
            title: `${tier} ${ach.titleRu}`,
            subtitle: ach.descriptionRu,
            icon: '🏆',
          });
        }
      }
    }

    return newlyUnlocked;
  },
}));

function evaluateCondition(condition: string, stats: Record<string, number>): boolean {
  // Conditions are like: "walks_total >= 10"
  const match = condition.match(/^(\w+)\s*(>=)\s*(\d+)$/);
  if (!match) return false;
  const [, key, , threshold] = match;
  const value = stats[key] ?? 0;
  return value >= Number(threshold);
}
