import { create } from 'zustand';
import { getWalksBetween } from '../services/database';
import type { Challenge, ChallengeType } from '../types';
import { generateId, getWeekRange } from '../utils/date';

interface ChallengeTemplate {
  type: ChallengeType;
  titleRu: string;
  titleEn: string;
  icon: string;
  target: number;
}

const WEEKLY_TEMPLATES: ChallengeTemplate[] = [
  { type: 'walk_count', titleRu: '5 прогулок за неделю', titleEn: '5 walks this week', icon: '🚶', target: 5 },
  { type: 'walk_count', titleRu: '3 прогулки за неделю', titleEn: '3 walks this week', icon: '🚶', target: 3 },
  { type: 'walk_distance', titleRu: '10 км за неделю', titleEn: '10 km this week', icon: '🏅', target: 10000 },
  { type: 'walk_distance', titleRu: '5 км за неделю', titleEn: '5 km this week', icon: '📏', target: 5000 },
  { type: 'walk_count', titleRu: '7 прогулок — каждый день!', titleEn: '7 walks — every day!', icon: '🔥', target: 7 },
  { type: 'walk_distance', titleRu: '20 км за неделю', titleEn: '20 km this week', icon: '🌍', target: 20000 },
];

interface ChallengeState {
  challenges: Challenge[];
  loading: boolean;
  generateWeeklyChallenges: () => void;
  refreshProgress: () => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  loading: false,

  generateWeeklyChallenges: () => {
    const { start, end } = getWeekRange();
    const existing = get().challenges;
    // Don't regenerate if we already have challenges for this week
    if (existing.length > 0 && existing[0].startDate === start) return;

    // Pick 3 random challenges for the week
    const shuffled = [...WEEKLY_TEMPLATES].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3);

    const newChallenges: Challenge[] = picked.map((tpl) => ({
      id: generateId(),
      type: tpl.type,
      titleRu: tpl.titleRu,
      titleEn: tpl.titleEn,
      target: tpl.target,
      current: 0,
      icon: tpl.icon,
      startDate: start,
      endDate: end,
      completed: false,
    }));

    set({ challenges: newChallenges });
  },

  refreshProgress: async () => {
    const challenges = get().challenges;
    if (challenges.length === 0) return;

    const { startDate, endDate } = challenges[0];
    const walks = await getWalksBetween(startDate, endDate) as any[];

    const walkCount = walks.length;
    const totalDistanceM = walks.reduce((sum: number, w: any) => sum + (w.distance_m || 0), 0);

    const updated = challenges.map((ch) => {
      let current = 0;
      if (ch.type === 'walk_count') current = walkCount;
      else if (ch.type === 'walk_distance') current = totalDistanceM;
      return { ...ch, current, completed: current >= ch.target };
    });

    set({ challenges: updated });
  },
}));
