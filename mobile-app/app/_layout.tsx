import "../global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Storage } from "@/utils/storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const [loaded] = useFonts({
    InterLight: require("../assets/fonts/Inter_24pt-Light.ttf"),
    InterRegular: require("../assets/fonts/Inter_24pt-Regular.ttf"),
    InterSemiBold: require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter_28pt-Bold.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        // Check if onboarding has been completed
        const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
        console.log(hasSeenOnboarding);

        // const hasSeenOnboarding = false;

        // For testing purposes, set onboarding as seen
        if (!hasSeenOnboarding) {
          await Storage.setHasSeenOnboarding(true);
          setHasSeenOnboarding(true);
        }

        setIsReady(true);
      } catch (error) {
        console.error("Error in app preparation:", error);
        setIsReady(true);
      }
    }

    if (loaded) {
      prepareApp();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
      if (!hasSeenOnboarding) {
        router.navigate("/(home)");
      }
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
