import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';

export type UserRole = 'ADMIN' | 'OGRETMEN' | 'OGRENCI' | 'VELI';

export interface AuthUser {
  id: number;
  tc: string;
  adSoyad: string;
  rol: UserRole;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Actions
  login: (tc: string, sifre: string) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (tc: string, sifre: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(tc, sifre);
      const data = response.data as AuthUser;

      // Token'ı kaydet
      await AsyncStorage.setItem('jwt_token', data.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(data));

      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      const msg = error?.response?.data || 'Giriş yapılamadı.';
      throw new Error(typeof msg === 'string' ? msg : 'TC veya şifre hatalı.');
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem('auth_user');
      const token = await AsyncStorage.getItem('jwt_token');
      if (stored && token) {
        const user = JSON.parse(stored) as AuthUser;
        set({ user, isAuthenticated: true });
      }
    } catch {
      // Storage hatası, temizle
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('auth_user');
    }
  },
}));
