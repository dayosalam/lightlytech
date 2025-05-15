import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
        {/* First progress bar - socket usage (manual gradient) */}
        <View style={[styles.progressBarWrapper, { width: `${socketPercentage}%` }]}>
          <View style={styles.manualGradientContainer}>
            {/* Create 5 segments with gradually changing colors from #6B2B0D to #FF671F */}
            <View style={[styles.gradientSegment, { backgroundColor: "#6B2B0D" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#8B3F17" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#AB5321" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#CB671B" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#FF671F" }]} />
          </View>
        </View>
        
        {/* Second progress bar - light usage (manual gradient) */}
        <View style={[styles.progressBarWrapper, { width: `${lightPercentage}%` }]}>
          <View style={styles.manualGradientContainer}>
            {/* Create 5 segments with gradually changing colors from #022322 to #B1BBBA */}
            <View style={[styles.gradientSegment, { backgroundColor: "#022322" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#2D4847" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#586D6C" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#849493" }]} />
            <View style={[styles.gradientSegment, { backgroundColor: "#B1BBBA" }]} />
          </View>
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
