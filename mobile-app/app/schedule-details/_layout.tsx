import React from "react";
import { Stack, useRouter, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function ScheduleLayout() {
  const router = useRouter();

  return (
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
            <Ionicons name="chevron-back" size={28} color="#022322" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Text style={styles.editScheduleText}>Edit Schedule</Text>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 8,
  },
  editScheduleText: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    color: "#FF671F",
  },
});
