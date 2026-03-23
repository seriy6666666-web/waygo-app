import { create } from 'zustand';
import type { MoodEntry, MoodKey } from '../types';

interface MoodState {
  todayMoods: MoodEntry[];
  latestMood: MoodKey | null;
  addMood: (entry: MoodEntry) => void;
  setTodayMoods: (moods: MoodEntry[]) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  todayMoods: [],
  latestMood: null,

  addMood: (entry) =>
    set((s) => ({
      todayMoods: [...s.todayMoods, entry],
      latestMood: entry.mood,
    })),

  setTodayMoods: (moods) =>
    set({
      todayMoods: moods,
      latestMood: moods.length > 0 ? moods[moods.length - 1].mood : null,
    }),
}));
