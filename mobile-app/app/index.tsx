import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Storage, SecureStorage } from "@/utils/storage";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    async function determineInitialRoute() {
      try {
        // Check user state
        const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
        const isAuthenticated = await SecureStorage.getIsAuthenticated();
        const token = await SecureStorage.getAccessToken();

        console.log("Root index - Has seen onboarding:", hasSeenOnboarding);
        console.log("Root index - Is authenticated:", isAuthenticated);
        console.log("Root index - Has token:", !!token);

        // Start with a default route that requires authentication
        let route = "/(getstarted)/auth";

        // First check if user has seen onboarding
        if (!hasSeenOnboarding) {
          route = "/(onboarding)";
        }
        // Then check authentication status and token validity
        else if (isAuthenticated && token) {
          // Check if token is expired
          const isExpired = await SecureStorage.isTokenExpired();

          if (isExpired) {
            console.log("Root index - Token expired, checking refresh token");
            const refreshToken = await SecureStorage.getRefreshToken();

            if (!refreshToken) {
              console.log("Root index - No refresh token, redirecting to auth");
              // Clear invalid auth state
              await SecureStorage.setIsAuthenticated(false);
              route = "/(getstarted)/auth";
            } else {
              // Let AuthContext handle token refresh
              route = "/(home)";
            }
          } else {
            // Token is valid, go to home
            route = "/(home)";
          }
        }
        // If not authenticated or no token, default route is already set to auth

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

  return <Redirect href={(initialRoute as any) || "/(getstarted)/auth"} />;
}
