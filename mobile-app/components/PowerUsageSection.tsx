import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface PowerUsageSectionProps {
  roomData: {
    powerUsage: {
      cost: string;
      energy: string;
      percentageChange: number;
      isIncrease: boolean;
    };
  };
}

const PowerUsageSection = ({ roomData }: PowerUsageSectionProps) => {
  return (
    <View style={styles.powerUsageSection}>
      <Text style={styles.sectionLabel}>Power usage</Text>

      <View style={styles.powerUsageAmount}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.amount}>
          {roomData.powerUsage.cost.split(".")[0].replace("₦", "")}
        </Text>
        <Text style={styles.decimal}>
          .{roomData.powerUsage.cost.split(".")[1]}
        </Text>
        <Text style={styles.unit}> / {roomData.powerUsage.energy}</Text>
      </View>

      <View style={styles.comparisonContainer}>
        <View style={styles.increaseIndicator}>
          <Ionicons
            name={roomData.powerUsage.isIncrease ? "arrow-up" : "arrow-down"}
            size={16}
            color="#dc3545"
          />
        </View>
        <Text style={styles.comparisonText}>
          Using up {roomData.powerUsage.percentageChange}% power more than
          yesterday
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  powerUsageSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#696969",
    marginBottom: 8,
    fontFamily: "InterRegular",
  },
  powerUsageAmount: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 36,
    fontFamily: "InterBold",
    color: "#022322",
  },
  amount: {
    fontSize: 36,
    fontFamily: "InterBold",
    color: "#022322",
  },
  decimal: {
    fontSize: 36,
    fontFamily: "InterBold",
    color: "#022322",
  },
  unit: {
    fontSize: 16,
    color: "#696969",
    fontFamily: "InterRegular",
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fcebec",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  increaseIndicator: {
    marginRight: 5,
    backgroundColor: "#ffff",
    borderRadius: "100%",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  comparisonText: {
    fontSize: 14,
    color: "#dc3545",
    fontFamily: "InterRegular",
  },
});

export default PowerUsageSection;
