import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { Storage } from "@/utils/storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const [loaded] = useFonts({
    InterLight: require("../assets/fonts/Inter_24pt-Light.ttf"),
    InterRegular: require("../assets/fonts/Inter_24pt-Regular.ttf"),
    InterSemiBold: require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter_28pt-Bold.ttf"),
  });

  useEffect(() => {
    async function checkOnboarding() {
      const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
      setInitialRoute(
        hasSeenOnboarding ? "(connectlightly)/index" : "(onboarding)"
      );
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !initialRoute) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="otp/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(getstarted)/distributionbox"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(getstarted)/auth"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(getstarted)/verify-email"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(getstarted)/success"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(connectlightly)/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(connectlightly)/SuccessConnect"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* <PortalHost name="connectlightly" /> */}
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
