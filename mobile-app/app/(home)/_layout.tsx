import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Storage } from "@/utils/storage";

export default function TabsLayout() {
  // Ensure we mark onboarding as seen when user reaches the home screen
  useEffect(() => {
    const markOnboardingComplete = async () => {
      await Storage.setHasSeenOnboarding(true);
    };
    
    markOnboardingComplete();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: "#fff",
          borderColor: "#fff",
          borderWidth: 1,
        },
        tabBarActiveTintColor: "#022322",
        tabBarInactiveTintColor: "#8b9a99",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="automation"
        options={{
          title: "Automation",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
