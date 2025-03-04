import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import RewardCard from "./RewardCard";

const RewardSection = () => {
  // Sample reward data
  const rewards = [
    {
      id: "1",
      amount: 5,
      description: "Spend at least ₦20 or 9Kw/H in the next 24hrs",
    },
    {
      id: "2",
      amount: 10,
      description: "Spend at least ₦40 or 18Kw/H in the next 48hrs",
    },
    {
      id: "3",
      amount: 15,
      description: "Reduce energy usage by 20% this week",
    },
  ];

  return (
    <View style={styles.rewardsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Earn rewards</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rewardsScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            amount={reward.amount}
            description={reward.description}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "InterBold",
    color: "#022322",
  },
  viewAllText: {
    fontSize: 16,
    color: "#878787",
    fontFamily: "InterRegular",
  },
  rewardsScroll: {
    marginLeft: -5,
  },
  scrollContent: {
    paddingLeft: 5,
    paddingRight: 15,
    paddingBottom: 10,
  },
});

export default RewardSection;
