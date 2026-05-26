import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Global store for the TrainMaster application
// Handles authentication token, current user profile, loading state, and simple UI flags.

export const useStore = create(
    devtools(
        persist(
            (set, get) => ({
                // Auth data
                token: null,
                user: null,
                isAuthenticated: false,
                // UI flags
                isLoading: false,
                // Actions
                setLoading: (loading) => set({ isLoading: loading }),
                setUser: (user) => set({ user, isAuthenticated: !!user }),
                setToken: (token) => set({ token, isAuthenticated: !!token }),
                login: async (email, password) => {
                    try {
                        get().setLoading(true);
                        const response = await fetch('http://localhost:5000/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email, password }),
                        });
                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data.message || 'Login failed');
                        }

                        get().setUser(data.user);
                        get().setToken(data.token);
                    } finally {
                        get().setLoading(false);
                    }
                },
                logout: () => {
                    set({ token: null, user: null, isAuthenticated: false });
                },
                checkAuth: async () => {
                    const { token, logout } = get();
                    if (!token) return;
                    try {
                        const response = await fetch('/api/auth/me');
                        if (!response.ok) {
                            logout();
                        }
                    } catch (err) {
                        console.error('Failed to validate session', err);
                    }
                },
                // Example of a UI toggle (e.g., sidebar open/close)
                ui: {
                    sidebarOpen: true,
                    toggleSidebar: () =>
                        set((state) => ({
                            ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
                        })),
                },
            }),
            {
                name: 'trainmaster-store', // storage key
                getStorage: () => localStorage,
            },
        ),
    ),
);
