import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:5182";

function getApiBaseUrl() {
	const envBaseUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
	return envBaseUrl ?? DEFAULT_API_BASE_URL;
}

export const apiClient: AxiosInstance = axios.create({
	baseURL: getApiBaseUrl(),
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

export type ConfigureAuthParams = {
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	setAccessToken: (token: string) => void;
	setRefreshToken: (token: string) => void;
	clearAuth: () => void;
};

let authConfigured = false;

export function configureAuth(params: ConfigureAuthParams) {
	if (authConfigured) {
		return;
	}
	authConfigured = true;

	apiClient.interceptors.request.use((config) => {
		const token = params.getAccessToken();
		if (token) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	apiClient.interceptors.response.use(
		(res) => res,
		async (error: AxiosError) => {
			const original = error.config as
				| (AxiosRequestConfig & { _retry?: boolean })
				| undefined;

			if (!original || original._retry) {
				throw error;
			}

			if (error.response?.status !== 401) {
				throw error;
			}

			const refreshToken = params.getRefreshToken();
			if (!refreshToken) {
				params.clearAuth();
				throw error;
			}

			original._retry = true;

			try {
				const refreshRes = await apiClient.post<{
					accessToken: string;
					refreshToken: string;
					expiresAt: string;
					user: unknown;
				}>("/api/auth/refresh", { refreshToken });

				params.setAccessToken(refreshRes.data.accessToken);
				params.setRefreshToken(refreshRes.data.refreshToken);

				original.headers = original.headers ?? {};
				(original.headers as any).Authorization =
					`Bearer ${refreshRes.data.accessToken}`;

				return apiClient(original);
			} catch (refreshErr) {
				params.clearAuth();
				throw refreshErr;
			}
		},
	);
}
