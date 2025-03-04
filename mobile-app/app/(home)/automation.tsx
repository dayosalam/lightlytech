import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function AutomationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Automation</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#8b9a99",
  },
});
