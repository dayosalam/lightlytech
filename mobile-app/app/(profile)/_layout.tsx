import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ProfileLayout = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Log the actual pathname to see what we're getting

  // Use includes instead of exact matching
  const isAccount =
    pathname.includes("/account") && !pathname.includes("/edit-account");
  console.log("isAccount", isAccount);
  const isEditAccount = pathname.includes("/edit-account");
  console.log("isEditAccount", isEditAccount);

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
            <TouchableOpacity onPress={() => router.back()}>
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
