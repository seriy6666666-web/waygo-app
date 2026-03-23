import { create } from 'zustand';
import type { RoutePoint, Walk } from '../types';

interface WalkState {
  // Current walk in progress
  isActive: boolean;
  isPaused: boolean;
  currentWalk: {
    startedAt: string | null;
    route: RoutePoint[];
    durationSec: number;
    steps: number;
  };
  // Saved walks
  todayWalks: Walk[];
  // Actions
  startWalk: () => void;
  pauseWalk: () => void;
  resumeWalk: () => void;
  addRoutePoint: (point: RoutePoint) => void;
  updateDuration: (sec: number) => void;
  updateSteps: (steps: number) => void;
  finishWalk: (walk: Walk) => void;
  setTodayWalks: (walks: Walk[]) => void;
  reset: () => void;
}

export const useWalkStore = create<WalkState>((set) => ({
  isActive: false,
  isPaused: false,
  currentWalk: {
    startedAt: null,
    route: [],
    durationSec: 0,
    steps: 0,
  },
  todayWalks: [],

  startWalk: () =>
    set({
      isActive: true,
      isPaused: false,
      currentWalk: {
        startedAt: new Date().toISOString(),
        route: [],
        durationSec: 0,
        steps: 0,
      },
    }),

  pauseWalk: () => set({ isPaused: true }),
  resumeWalk: () => set({ isPaused: false }),

  addRoutePoint: (point) =>
    set((s) => ({
      currentWalk: {
        ...s.currentWalk,
        route: [...s.currentWalk.route, point],
      },
    })),

  updateDuration: (sec) =>
    set((s) => ({
      currentWalk: { ...s.currentWalk, durationSec: sec },
    })),

  updateSteps: (steps) =>
    set((s) => ({
      currentWalk: { ...s.currentWalk, steps },
    })),

  finishWalk: (walk) =>
    set((s) => ({
      isActive: false,
      isPaused: false,
      currentWalk: { startedAt: null, route: [], durationSec: 0, steps: 0 },
      todayWalks: [...s.todayWalks, walk],
    })),

  setTodayWalks: (walks) => set({ todayWalks: walks }),

  reset: () =>
    set({
      isActive: false,
      isPaused: false,
      currentWalk: { startedAt: null, route: [], durationSec: 0, steps: 0 },
    }),
}));
