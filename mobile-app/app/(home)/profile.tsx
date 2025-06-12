"use client";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/profile/Avatar";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

// Menu item component
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>{icon}</View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8b9a99" />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogOut = async () => {
    router.replace("/(getstarted)/auth");
    await logout();
  };

  const handleNavigation = (route: string) => {
    // Use the route as is without type checking
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Avatar emoji={user?.emoji || ""} name={user?.condo_name || ""} />
        </View>

        <View style={styles.menuContainer}>
          <MenuItem
            icon={<Ionicons name="person-outline" size={24} color="#022322" />}
            title="Account Information"
            subtitle="View and edit profile"
            onPress={() => handleNavigation("/(profile)/account")}
          />

          {/* <MenuItem
            icon={
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#022322"
              />
            }
            title="Notifications"
            subtitle="Set up notifications"
            onPress={() => handleNavigation("/(profile)/notifications")}
          /> */}

          <MenuItem
            icon={<Ionicons name="shield-outline" size={24} color="#022322" />}
            title="Security"
            subtitle="Change your email and password"
            onPress={() => handleNavigation("/(profile)/security")}
          />

          {/* <MenuItem
            icon={<Ionicons name="gift-outline" size={24} color="#022322" />}
            title="Rewards"
            subtitle="Manage earned rewards"
            onPress={() => handleNavigation("/(profile)/rewards")}
          /> */}

          <MenuItem
            icon={<Ionicons name="cube-outline" size={24} color="#022322" />}
            title="My Lightly Box"
            subtitle="Manage your Lightly Box"
            onPress={() => handleNavigation("/(profile)/lightly-box-settings")}
          />

          <MenuItem
            icon={
              <Ionicons name="help-circle-outline" size={24} color="#022322" />
            }
            title="Support"
            subtitle="Reach out to us"
            onPress={() => handleNavigation("/(profile)/support")}
          />
        </View>
        <TouchableOpacity style={styles.logOutButton} className="my-4 items-center" onPress={() => handleLogOut()}
        >
          <Text style={styles.logOuttext} className="text-black font-[InterSemiBold]">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  logOutButton: {
alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
  },
  logOuttext: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    fontFamily: "InterRegular",
    color: "#8b9a99",
  },
});
