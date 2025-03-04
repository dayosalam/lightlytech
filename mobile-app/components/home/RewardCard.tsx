import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface RewardCardProps {
  amount: number;
  description: string;
}

const RewardCard = ({ amount, description }: RewardCardProps) => {
  return (
    <View style={styles.rewardCard}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.3)", "rgba(2, 35, 34, 0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.45, y: 0.5 }}
        style={styles.gradient}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Earn {amount} Lightly Coins</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.coinContainer}>
          <Image
            source={require("@/assets/icons/points.png")}
            style={styles.coinImage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardCard: {
    backgroundColor: "#022322",
    borderRadius: 12,
    padding: 16,
    position: "relative",
    marginHorizontal: 6,
    marginRight: 12,
    width: 370,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden", // Important for the gradient to be contained
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
    fontFamily: "InterRegular",
    lineHeight: 20,
  },
  coinContainer: {
    position: "absolute",
    right: -10,
    bottom: 10,
  },
  coinImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
});

export default RewardCard;
