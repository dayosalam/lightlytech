import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface UsageBreakdownCardProps {
  socketUsage: string;
  lightUsage: string;
  socketPercentage?: number; // Percentage of the total (0-100)
  lightPercentage?: number; // Percentage of the total (0-100)
  containerStyle?: object;
}

export default function UsageBreakdownCard({
  socketUsage,
  lightUsage,
  socketPercentage = 60,
  lightPercentage = 40,
  containerStyle = {},
}: UsageBreakdownCardProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Socket Usage */}
      <View style={styles.usageSection}>
        <Text style={styles.usageLabel}>Socket usage</Text>
        <Text style={styles.usageLabel}>Light usage</Text>
      </View>

      {/* Light Usage */}
      <View style={styles.usageSection}>
        <Text style={styles.usageValue}>{socketUsage}</Text>
        <Text style={styles.usageValue}>{lightUsage}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        {/* First progress bar - socket usage (linear gradient) */}
        <View style={[styles.progressBarWrapper, { width: `${socketPercentage}%` }]}> 
          <LinearGradient
            colors={["#6B2B0D", "#8B3F17", "#AB5321", "#CB671B", "#FF671F"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        {/* Second progress bar - light usage (linear gradient) */}
        <View style={[styles.progressBarWrapper, { width: `${lightPercentage}%` }]}> 
          <LinearGradient
            colors={["#022322", "#2D4847", "#586D6C", "#849493", "#B1BBBA"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: 350,
    marginBottom: 30,
    alignSelf: "center",
  },
  usageSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 16,
    color: "#696969",
    fontFamily: "InterRegular",
  },
  usageValue: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  progressBarContainer: {
    flexDirection: "row",
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBarWrapper: {
    height: "100%",
    marginRight: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  manualGradientContainer: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
  gradientSegment: {
    flex: 1,
    height: "100%",
  },
});
