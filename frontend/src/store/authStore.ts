import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '../types';
import api from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  addresses: Address[];
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      addresses: [],
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) =>
        set((state) => ({
          addresses: address.isDefault
            ? [...state.addresses.map((a) => ({ ...a, isDefault: false })), address]
            : [...state.addresses, address],
        })),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, addresses: [] });
      },
      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await api.get('/me');
          if (res.data.success && res.data.data) {
            set({
              user: res.data.data,
              addresses: res.data.data.addresses || [],
              isAuthenticated: true,
            });
          }
        } catch (err) {
          console.error('Failed to fetch current user', err);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
