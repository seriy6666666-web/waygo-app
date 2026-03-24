import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserSettings } from '../types';
import { getTodayDate } from '../utils/date';

interface SettingsState extends UserSettings {
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  setName: (name: string) => void;
  setWeeklyGoal: (goal: number) => void;
  setAdaptiveAmbiance: (v: boolean) => void;
  setLocale: (locale: 'ru' | 'en') => void;
  useFreeze: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(persist((set, get) => ({
  hasOnboarded: false,
  name: '',
  weeklyGoal: 5,
  adaptiveAmbiance: true,
  locale: 'ru',
  freezesLeft: 3,
  frozenDates: [],

  setHasOnboarded: (v) => set({ hasOnboarded: v }),
  setName: (name) => set({ name }),
  setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
  setAdaptiveAmbiance: (v) => set({ adaptiveAmbiance: v }),
  setLocale: (locale) => set({ locale }),

  useFreeze: () => {
    const { freezesLeft, frozenDates } = get();
    const today = getTodayDate();
    if (freezesLeft <= 0 || frozenDates.includes(today)) return false;
    set({ freezesLeft: freezesLeft - 1, frozenDates: [...frozenDates, today] });
    return true;
  },
}), {
  name: 'waygo-settings',
  storage: createJSONStorage(() => AsyncStorage),
}));
