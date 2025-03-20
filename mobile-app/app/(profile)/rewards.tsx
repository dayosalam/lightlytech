import { StyleSheet, Text, View, ScrollView, Alert, Share } from "react-native";
import React, { useState } from "react";
import RewardsSummary from "@/components/rewards/RewardsSummary";
import InviteFriends from "@/components/rewards/InviteFriends";
import RewardCard from "@/components/rewards/RewardCard";

interface TokenReward {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal: number;
  current: number;
}

const Rewards = () => {
  const [totalRewards, setTotalRewards] = useState(10.05);
  const [inviteTokens, setInviteTokens] = useState(2);
  
  const [tokenRewards, setTokenRewards] = useState<TokenReward[]>([
    {
      id: "reward1",
      title: "Token Reward",
      description: "Use N20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
    {
      id: "reward2",
      title: "Token Reward",
      description: "Use N20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
    {
      id: "reward3",
      title: "Token Reward",
      description: "Use N20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
  ]);

  const handleRewardHistoryPress = () => {
    // Navigate to reward history or show modal
    Alert.alert("Coming Soon", "Reward history will be available soon!");
  };

  const handleInviteFriends = async () => {
    try {
      const result = await Share.share({
        message:
          "Join me on Lightly! Save energy and earn rewards. Use my referral code: LIGHTLY123",
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          Alert.alert("Success", "Invitation sent successfully!");
        } else {
          // shared
          Alert.alert("Success", "Invitation sent successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert("Error", "Could not share the invitation");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Rewards</Text>
          
          {/* Rewards Summary */}
          <RewardsSummary 
            totalRewards={totalRewards} 
            onHistoryPress={handleRewardHistoryPress} 
          />
          
          {/* Invite Friends */}
          <InviteFriends 
            tokenAmount={inviteTokens} 
            onInvitePress={handleInviteFriends} 
          />
          
          {/* Earn Rewards Section */}
          <Text style={styles.sectionTitle}>Earn rewards</Text>
          
          <View style={styles.rewardsContainer}>
            {tokenRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                title={reward.title}
                description={reward.description}
                progress={reward.progress}
                goal={reward.goal}
                current={reward.current}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Rewards;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 24,
  },
  container: {
    width: "90%",
    maxWidth: 500,
    paddingTop: 16,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 16,
    textAlign: "left",
  },
  rewardsContainer: {
    width: "100%",
  },
});
