import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PowerUsage = ({ bill, totalEnergy }: { bill: number; totalEnergy: number }) => {
  return (
    <View style={styles.powerUsageSection}>
      <Text style={styles.sectionTitle}>Today's power usage</Text>
      <View style={styles.powerUsageAmount}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.amount}>{bill}</Text>
        <Text style={styles.unit}> / {totalEnergy}Kw/H</Text>
      </View>
      {/* <View style={styles.comparisonContainer}>
        <View style={styles.increaseIndicator}>
          <Ionicons name="arrow-up" size={16} color="#dc3545" />
        </View>
        <Text style={styles.comparisonText}>12% more than yesterday</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  powerUsageSection: {
    paddingHorizontal: 20,
    marginVertical: 15,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#878787",
    marginBottom: 8,
    fontFamily: "InterRegular",
  },
  powerUsageAmount: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  currency: {
    fontSize: 32,
    color: "#022322",
    fontFamily: "InterSemiBold",
  },
  amount: {
    fontSize: 32,
    color: "#022322",
    fontFamily: "InterBold",
    marginLeft: 4,
  },
  unit: {
    fontSize: 14,
    color: "#878787",
    fontFamily: "InterRegular",
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  increaseIndicator: {
    backgroundColor: "#fde8e8",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  comparisonText: {
    fontSize: 14,
    color: "#dc3545",
    fontFamily: "InterRegular",
  },
});

export default PowerUsage;
