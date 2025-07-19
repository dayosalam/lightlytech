import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Token from "@/assets/icons/points.svg";

interface RewardsSummaryProps {
  totalRewards: number;
  onHistoryPress?: () => void;
}

const RewardsSummary = ({
  totalRewards,
  onHistoryPress,
}: RewardsSummaryProps) => {
  const router = useRouter();

  const handleHistoryPress = () => {
    if (onHistoryPress) {
      onHistoryPress();
    } else {
      // Default navigation if no custom handler provided
      router.push("reward-history" as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.contentContainer, { backgroundColor: "#022322" }]}>
        <Text style={styles.rewardsAmount}>
          {(totalRewards || 0).toFixed(2)}
          <Token style={{ transform: [{ rotate: "70deg" }] }} />
        </Text>
        <Text style={styles.rewardsLabel}>Total rewards earned</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleHistoryPress}
          activeOpacity={0.7}
        >
          <Text style={styles.historyButtonText}>Reward history</Text>
          <Ionicons name="chevron-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RewardsSummary;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  contentContainer: {
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#022322", // Fallback solid color instead of gradient
  },
  rewardsAmount: {
    fontSize: 36,
    fontFamily: "InterBold",
    color: "#ffffff",
    marginBottom: 4,
  },
  tokenIcon: {
    fontSize: 24,
    marginLeft: 4,
  },
  rewardsLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: 16,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  historyButtonText: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#ffffff",
    marginRight: 4,
  },
});
