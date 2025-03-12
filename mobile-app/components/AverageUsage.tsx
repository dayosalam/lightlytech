import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Svg, Path } from "react-native-svg";

const AverageUsage = () => {
  return (
    <View style={styles.averageUsageContainer}>
      <View style={styles.averageUsageTextContainer}>
        <Text style={styles.averageUsageLabel}>Average usage</Text>
        <Text style={styles.averageUsageDescription}>
          Your average power consumption monthly is about{" "}
          <Text style={styles.averageUsageHighlight}>₦2,000</Text> or{" "}
          <Text style={styles.averageUsageHighlight}>9kW/h</Text>
        </Text>
      </View>
      <View style={styles.averageUsageGraph}>
        <Image
          source={require("@/assets/images/Graph.png")}
          width={40}
          height={40}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default AverageUsage;

const styles = StyleSheet.create({
  averageUsageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 24,
  },
  averageUsageLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#878787",
    marginBottom: 8,
  },
  averageUsageDescription: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#696969",
    marginBottom: 16,
  },
  averageUsageHighlight: {
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  averageUsageGraph: {
    marginTop: 8,
  },
  averageUsageTextContainer: {
    flex: 1,
  },
});
