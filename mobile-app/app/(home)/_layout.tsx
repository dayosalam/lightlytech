import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Storage } from "@/utils/storage";
import { usePathname } from "expo-router";

import Home from "@/assets/icons/home-2.svg";
import HomeActive from "@/assets/icons/home-active.svg";
import InsightsActive from "@/assets/icons/insights-active.svg";
import Insights from "@/assets/icons/insights.svg";
import Automation from "@/assets/icons/automation.svg";
import AutomationActive from "@/assets/icons/automation-active.svg";
import ProfileActive from "@/assets/icons/profile-active.svg";
import Profile from "@/assets/icons/profile.svg";

export default function TabsLayout() {
  useEffect(() => {
    const markOnboardingComplete = async () => {
      await Storage.setHasSeenOnboarding(true);
    };

    markOnboardingComplete();
  }, []);

  const pathname = usePathname();

  const isHomeIndex = pathname === "/";
  const isInsights = pathname === "/insights";
  const isAutomation = pathname === "/automation";
  const isProfile = pathname === "/profile";

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
          tabBarIcon: ({ color, size }) =>
            isHomeIndex ? (
              <HomeActive width={size} />
            ) : (
              <Home color={color} width={size} />
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
          tabBarIcon: ({ color, size }) =>
            isInsights ? (
              <InsightsActive width={size} />
            ) : (
              <Insights color={color} width={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="automation"
        options={{
          title: "Automation",
          tabBarIcon: ({ color, size }) =>
            isAutomation ? (
              <AutomationActive width={size} />
            ) : (
              <Automation color={color} width={size} />
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
          tabBarIcon: ({ color, size }) =>
            isProfile ? (
              <ProfileActive width={size} />
            ) : (
              <Profile color={color} width={size} />
            ),
        }}
      />
    </Tabs>
  );
}
