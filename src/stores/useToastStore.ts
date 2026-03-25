import { create } from 'zustand';

export interface ToastItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

interface ToastState {
  current: ToastItem | null;
  show: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: () => void;
}

let counter = 0;
let activeTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  current: null,

  show: (toast) => {
    if (activeTimeoutId) clearTimeout(activeTimeoutId);
    const id = `toast_${++counter}`;
    set({ current: { ...toast, id } });
    activeTimeoutId = setTimeout(() => {
      set((s) => (s.current?.id === id ? { current: null } : s));
      activeTimeoutId = null;
    }, 3000);
  },

  dismiss: () => {
    if (activeTimeoutId) clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
    set({ current: null });
  },
}));
