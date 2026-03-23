import { create } from 'zustand';
import { insertSleep } from '../services/database';
import type { SleepEntry } from '../types';

interface SleepState {
  entries: SleepEntry[];
  todayEntry: SleepEntry | null;

  addEntry: (entry: SleepEntry) => Promise<void>;
  setEntries: (entries: SleepEntry[]) => void;
  setTodayEntry: (entry: SleepEntry | null) => void;
  getWeekAverage: () => number;
}

export const useSleepStore = create<SleepState>((set, get) => ({
  entries: [],
  todayEntry: null,

  addEntry: async (entry) => {
    await insertSleep({
      id: entry.id,
      date: entry.date,
      bedTime: entry.bedTime,
      wakeTime: entry.wakeTime,
      quality: entry.quality,
      durationMin: entry.durationMin,
    });
    set((s) => ({
      entries: [entry, ...s.entries],
      todayEntry: entry,
    }));
  },

  setEntries: (entries) => set({ entries }),
  setTodayEntry: (entry) => set({ todayEntry: entry }),

  getWeekAverage: () => {
    const { entries } = get();
    const last7 = entries.slice(0, 7);
    if (last7.length === 0) return 0;
    const total = last7.reduce((sum, e) => sum + e.durationMin, 0);
    return Math.round(total / last7.length);
  },
}));
