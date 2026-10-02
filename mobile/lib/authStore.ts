import { create } from "zustand";
import { api } from "@/lib/api";
import {
	deleteTokens,
	getAccessToken,
	getRefreshToken,
	setTokens,
} from "./storage";

interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "User" | "Admin" | "Support" | "Merchant";
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isInitializing: boolean;
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	clearAuth: () => void;
	initializeAuth: () => Promise<void>;
	setAccessToken: (token: string) => void;
	setTokensFromRefresh: (accessToken: string, refreshToken: string) => void;
	updateUser: (patch: Partial<User>) => void;
}

// initializeAuth runs once per app launch
// concurrent callers share the same promise
let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isInitializing: true,

	setAuth: (user, accessToken, refreshToken) => {
		set({ user, accessToken, refreshToken, isAuthenticated: true });
		void setTokens({ accessToken, refreshToken });
	},

	clearAuth: () => {
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
		void deleteTokens();
	},

	setAccessToken: (token: string) => {
		set({ accessToken: token });
	},

	setTokensFromRefresh: (accessToken: string, refreshToken: string) => {
		set({ accessToken, refreshToken, isAuthenticated: true });
		void setTokens({ accessToken, refreshToken });
	},

	updateUser: (patch) => {
		set((state) => (state.user ? { user: { ...state.user, ...patch } } : {}));
	},

	initializeAuth: () => {
		initPromise ??= (async () => {
			set({ isInitializing: true });
			try {
				const accessToken = await getAccessToken();
				const refreshToken = await getRefreshToken();

				if (accessToken && refreshToken) {
					set({ accessToken, refreshToken, isAuthenticated: true });

					const meRes = await api.get<User>("/auth/me", { auth: true });
					if (meRes.ok) {
						set({ user: meRes.data });
					} else {
						set({
							user: null,
							accessToken: null,
							refreshToken: null,
							isAuthenticated: false,
						});
						await deleteTokens();
					}
				} else {
					set({
						isAuthenticated: false,
						user: null,
						accessToken: null,
						refreshToken: null,
					});
				}
			} catch (error) {
				console.error("Auth initialization error:", error);
				set({
					isAuthenticated: false,
					user: null,
					accessToken: null,
					refreshToken: null,
				});
			} finally {
				set({ isInitializing: false });
			}
		})();
		return initPromise;
	},
}));
