import { create } from 'zustand';
import { insertHabit, toggleHabitLog } from '../services/database';
import type { Habit } from '../types';
import { getTodayDate } from '../utils/date';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { useAchievementStore } from './useAchievementStore';

interface HabitState {
  habits: Habit[];
  todayLogs: Record<string, boolean>; // habitId -> done

  addHabit: (habit: Habit) => Promise<void>;
  removeHabit: (id: string) => void;
  toggle: (habitId: string) => Promise<void>;
  setHabits: (habits: Habit[]) => void;
  setTodayLogs: (logs: Record<string, boolean>) => void;
  getTodayProgress: () => { done: number; total: number };
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  todayLogs: {},

  addHabit: async (habit) => {
    await insertHabit({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      createdAt: habit.createdAt,
    });
    set((s) => ({ habits: [...s.habits, habit] }));
  },

  removeHabit: (id) => {
    set((s) => ({
      habits: s.habits.filter((h) => h.id !== id),
      todayLogs: Object.fromEntries(
        Object.entries(s.todayLogs).filter(([k]) => k !== id)
      ),
    }));
  },

  toggle: async (habitId) => {
    const current = get().todayLogs[habitId] ?? false;
    const next = !current;
    next ? hapticSuccess() : hapticLight();
    const date = getTodayDate();
    await toggleHabitLog(habitId, date, next);
    set((s) => ({
      todayLogs: { ...s.todayLogs, [habitId]: next },
    }));
    if (next) useAchievementStore.getState().checkAndUnlock();
  },

  setHabits: (habits) => set({ habits }),
  setTodayLogs: (logs) => set({ todayLogs: logs }),

  getTodayProgress: () => {
    const { habits, todayLogs } = get();
    const total = habits.length;
    const done = habits.filter((h) => todayLogs[h.id]).length;
    return { done, total };
  },
}));
