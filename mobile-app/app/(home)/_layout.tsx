import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Storage } from "@/utils/storage";

export default function TabsLayout() {
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
          headerShown: true,
          headerTitle: "Insights",
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: "InterBold",
            color: "#022322",
          },
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
          headerShown: true,
          headerTitle: "Profile",
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: "InterBold",
            color: "#022322",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
