import React from "react";
import { Stack, useRouter, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";

export default function RoomLayout() {
  const router = useRouter();

  const handleBack = () => {
    // Explicitly navigate back to the home screen
    router.push("/(home)");
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Ionicons name="chevron-back" size={28} color="#022322" />
            </TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "ios" ? 30 : 20,
  },
  headerButton: {
    // padding: 8,
    // marginLeft: 8,
  },
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
});
