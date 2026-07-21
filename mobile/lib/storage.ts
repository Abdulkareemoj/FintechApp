import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }

  if (key === ACCESS_TOKEN_KEY) {
    return memoryAccessToken;
  }

  if (key === REFRESH_TOKEN_KEY) {
    return memoryRefreshToken;
  }

  return null;
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
    return;
  }

  if (key === ACCESS_TOKEN_KEY) {
    memoryAccessToken = value;
    return;
  }

  if (key === REFRESH_TOKEN_KEY) {
    memoryRefreshToken = value;
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.localStorage.removeItem(key);
    return;
  }

  if (key === ACCESS_TOKEN_KEY) {
    memoryAccessToken = null;
    return;
  }

  if (key === REFRESH_TOKEN_KEY) {
    memoryRefreshToken = null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function setTokens(params: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, params.accessToken);
  await setItem(REFRESH_TOKEN_KEY, params.refreshToken);
}

export async function deleteTokens(): Promise<void> {
  await removeItem(ACCESS_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
}
