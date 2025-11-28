import { Stack, useRouter, useSegments, useRootNavigationState, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import ThemeProvider from "../components/ThemeContext";
// SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState(); // 1. Get navigation state
  const { user, token, checkAuth } = useAuthStore();
  
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    init();
  }, []);


  // 3. Handle Protection / Redirection
  useEffect(() => {
    // CRITICAL FIX: Wait for navigation to be ready and auth to finish initializing
    if (!navigationState?.key || !isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token; // Ensure boolean values

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [navigationState?.key, isInitialized, user, token, segments]);

  // 4. Show a loading spinner while checking auth state
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <SafeScreen>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}