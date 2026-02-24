import { create } from "zustand";

import { apiClient, configureAuth } from "@/lib/apiClient";

export type UserRole = "User" | "Admin" | "Support" | "Merchant";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function getStoredToken(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
}

function setStoredToken(key: string, value: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (value) {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.removeItem(key);
  }
}

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initializeAuth: () => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<AuthUser>;
  register: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAccessToken: (token) => {
    set({ accessToken: token });
    setStoredToken(ACCESS_TOKEN_KEY, token);
  },

  clearAuth: () => {
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    setStoredToken(ACCESS_TOKEN_KEY, null);
    setStoredToken(REFRESH_TOKEN_KEY, null);
  },

  initializeAuth: async () => {
    set({ isInitializing: true });

    const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
    const refreshToken = getStoredToken(REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
      set({ isInitializing: false, isAuthenticated: false });
      return;
    }

    set({ accessToken, refreshToken, isAuthenticated: true });

    try {
      const meRes = await apiClient.get<AuthUser>("/api/auth/me");
      set({ user: meRes.data });
    } catch {
      get().clearAuth();
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async ({ email, password }) => {
    const res = await apiClient.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    const user: AuthUser = {
      id: res.data.user.id,
      email: res.data.user.email,
      firstName: res.data.user.firstName,
      lastName: res.data.user.lastName,
      role: res.data.user.role,
    };

    set({
      user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      isAuthenticated: true,
    });

    setStoredToken(ACCESS_TOKEN_KEY, res.data.accessToken);
    setStoredToken(REFRESH_TOKEN_KEY, res.data.refreshToken);

    return user;
  },

  register: async ({ email, password, firstName, lastName, phone }) => {
    const res = await apiClient.post<AuthResponse>("/api/auth/register", {
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    const user: AuthUser = {
      id: res.data.user.id,
      email: res.data.user.email,
      firstName: res.data.user.firstName,
      lastName: res.data.user.lastName,
      role: res.data.user.role,
    };

    set({
      user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      isAuthenticated: true,
    });

    setStoredToken(ACCESS_TOKEN_KEY, res.data.accessToken);
    setStoredToken(REFRESH_TOKEN_KEY, res.data.refreshToken);

    return user;
  },

  logout: async () => {
    const refreshToken = get().refreshToken;

    try {
      if (refreshToken) {
        await apiClient.post("/api/auth/logout", { refreshToken });
      }
    } finally {
      get().clearAuth();
    }
  },
}));

configureAuth({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  clearAuth: () => useAuthStore.getState().clearAuth(),
});
