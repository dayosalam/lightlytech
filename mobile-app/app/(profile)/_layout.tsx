import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ProfileLayout = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Handle back navigation
  const handleBack = () => {
    // If we're in a profile sub-screen, go back to the main profile screen
    if (pathname.includes("/account") || 
        pathname.includes("/notifications") || 
        pathname.includes("/security") || 
        pathname.includes("/rewards") ||
        pathname.includes("/change-password") ||
        pathname.includes("/change-email") ||
        pathname.includes("/lightly-box-settings") ||
        pathname.includes("/support") ||
        pathname.includes("/invite-friends")) {
      router.push("/(home)/profile");
    } else {
      router.back();
    }
  };

  // Use includes instead of exact matching
  const isAccount =
    pathname.includes("/account") && !pathname.includes("/edit-account");
  const isEditAccount = pathname.includes("/edit-account");

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f5f5f5",
          },
          headerTitleStyle: {
            fontFamily: "InterSemiBold",
            fontSize: 18,
            color: "#022322",
          },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#022322" />
            </TouchableOpacity>
          ),
          headerRight: () =>
            isAccount ? (
              <TouchableOpacity
                onPress={() => router.push("/(profile)/edit-account")}
              >
                <Text style={styles.editAccountText}>Edit account</Text>
              </TouchableOpacity>
            ) : null,
        }}
      >
        <Stack.Screen
          name="account"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="edit-account"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="notifications"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="security"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="change-password"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="change-email"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="rewards"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="lightly-box-settings"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="support"
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name="invite-friends"
          options={{ headerShown: true, title: "" }}
        />
      </Stack>
    </View>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  editAccountText: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#FF671F",
  },
});
