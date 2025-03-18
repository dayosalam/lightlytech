import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Storage } from "@/utils/storage";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function determineInitialRoute() {
      try {
        // Check user state
        const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
        // const isAuthenticated = await Storage.getIsAuthenticated();
        const isAuthenticated = false;
        const hasConnectedBox = await Storage.getHasConnectedBox();

        console.log("Root index - Has seen onboarding:", hasSeenOnboarding);
        console.log("Root index - Is authenticated:", isAuthenticated);
        console.log("Root index - Has connected box:", hasConnectedBox);

        let route = "/(home)";

        if (!hasSeenOnboarding) {
          route = "/(onboarding)";
        } else if (!isAuthenticated) {
          route = "/(getstarted)/auth";
        } else if (!hasConnectedBox) {
          route = "/setup";
        }

        console.log("Root index - Navigating to:", route);
        setInitialRoute(route);
      } catch (error) {
        console.error("Error determining initial route:", error);
        // Default to auth if there's an error
        setInitialRoute("/(getstarted)/auth");
      } finally {
        setLoading(false);
      }
    }

    determineInitialRoute();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#004D40" />
      </View>
    );
  }

  return <Redirect href={initialRoute || "/(getstarted)/auth"} />;
}
