import { create } from 'zustand';
import { authApi } from '@/api';

type View = 'login' | 'dashboard';

interface AppState {
    view: View;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setView: (view: View) => void;
    setAuthenticated: (value: boolean) => void;
    setLoading: (value: boolean) => void;
    login: (password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    view: 'login',
    isAuthenticated: false,
    isLoading: true,

    setView: (view) => set({ view }),
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    setLoading: (value) => set({ isLoading: value }),

    login: async (password: string) => {
        try {
            const result = await authApi.login(password);
            if (result.success) {
                set({ isAuthenticated: true, view: 'dashboard' });
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore logout errors
        }
        set({ isAuthenticated: false, view: 'login' });
    },

    checkAuth: async () => {
        try {
            const data = await authApi.check();
            set({
                isAuthenticated: data.authenticated,
                view: data.authenticated ? 'dashboard' : 'login',
                isLoading: false
            });
        } catch {
            set({ isAuthenticated: false, view: 'login', isLoading: false });
        }
    },
}));
