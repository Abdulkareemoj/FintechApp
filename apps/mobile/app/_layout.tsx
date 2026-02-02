import { Stack } from "expo-router";
import { router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "nativewind";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/theme";
import { useAuthStore } from "@/lib/authStore";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const segments = useSegments();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await initializeAuth();
      if (!cancelled) {
        setIsAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initializeAuth]);

  React.useEffect(() => {
    if (!isColorSchemeLoaded || !isAuthReady) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inDrawerGroup = segments[0] === "(drawer)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    if (isAuthenticated && !inDrawerGroup) {
      router.replace("/(drawer)" as any);
    }
  }, [isAuthenticated, isAuthReady, isColorSchemeLoaded, segments]);

  if (!isColorSchemeLoaded || !isAuthReady) {
    return null;
  }
  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
