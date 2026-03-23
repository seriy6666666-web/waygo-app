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

export const useToastStore = create<ToastState>((set) => ({
  current: null,

  show: (toast) => {
    const id = `toast_${++counter}`;
    set({ current: { ...toast, id } });
    setTimeout(() => {
      set((s) => (s.current?.id === id ? { current: null } : s));
    }, 3000);
  },

  dismiss: () => set({ current: null }),
}));
