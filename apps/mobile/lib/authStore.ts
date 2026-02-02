import { create } from 'zustand';
import { deleteTokens, getAccessToken, getRefreshToken, setTokens } from './storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'merchant' | 'support' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken, isAuthenticated: true });
    void setTokens({ accessToken, refreshToken });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    void deleteTokens();
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  initializeAuth: async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (accessToken && refreshToken) {
      // In a real app, you might want to verify the accessToken with the backend
      // or decode it to get user info without a full API call here.
      // For now, we'll assume the presence of tokens means authenticated.
      // A more robust solution would fetch user profile on app start.
      set({ accessToken, refreshToken, isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },
}));
