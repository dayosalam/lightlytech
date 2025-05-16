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
        const isAuthenticated = await Storage.getIsAuthenticated();

        console.log("Root index - Has seen onboarding:", hasSeenOnboarding);
        console.log("Root index - Is authenticated:", isAuthenticated);

        // Start with a default route that requires authentication
        let route = "/(getstarted)/auth";

        // First check if user has seen onboarding
        if (!hasSeenOnboarding) {
          route = "/(onboarding)";
        }
        // Then check authentication status
        else if (isAuthenticated) {
          // User is authenticated, go directly to home
          route = "/(onboarding)";
        }
        // If not authenticated, default route is already set to auth

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
