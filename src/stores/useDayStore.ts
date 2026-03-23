import { create } from 'zustand';
import type { DayCard } from '../types';

interface DayState {
  todayCard: DayCard | null;
  recentCards: DayCard[];
  setTodayCard: (card: DayCard | null) => void;
  setRecentCards: (cards: DayCard[]) => void;
}

export const useDayStore = create<DayState>((set) => ({
  todayCard: null,
  recentCards: [],

  setTodayCard: (card) => set({ todayCard: card }),
  setRecentCards: (cards) => set({ recentCards: cards }),
}));
