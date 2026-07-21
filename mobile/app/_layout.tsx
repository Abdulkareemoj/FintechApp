import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/lib/authStore";
import { queryClient } from "@/lib/queryClient";
import { NAV_THEME } from "@/lib/theme";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { theme } = useUniwind();

  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const segments = useSegments();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  const useIsomorphicLayoutEffect =
    Platform.OS === "web" && typeof window === "undefined"
      ? React.useEffect
      : React.useLayoutEffect;

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
  }, []);

  React.useEffect(() => {
    if (!(isColorSchemeLoaded && isAuthReady)) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inDrawerGroup = segments[0] === "(drawer)";

    // Simplified routing logic to prevent infinite loops
    if (!(isAuthenticated || inAuthGroup)) {
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(drawer)/(tabs)/home" as any);
      return;
    }
  }, [isAuthenticated, isAuthReady, isColorSchemeLoaded, segments]);

  if (!(isColorSchemeLoaded && isAuthReady)) {
    return null;
  }
  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />

              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaListener>
  );
}
