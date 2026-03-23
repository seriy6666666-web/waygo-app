import { create } from 'zustand';
import type { WeeklyRecap } from '../types';

interface RecapState {
  currentRecap: WeeklyRecap | null;
  recaps: WeeklyRecap[];
  setCurrentRecap: (recap: WeeklyRecap | null) => void;
  setRecaps: (recaps: WeeklyRecap[]) => void;
}

export const useRecapStore = create<RecapState>((set) => ({
  currentRecap: null,
  recaps: [],

  setCurrentRecap: (recap) => set({ currentRecap: recap }),
  setRecaps: (recaps) => set({ recaps }),
}));
