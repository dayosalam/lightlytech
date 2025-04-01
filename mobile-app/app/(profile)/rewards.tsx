import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Share,
  Animated,
  Dimensions,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import RewardsSummary from "@/components/rewards/RewardsSummary";
import InviteFriends from "@/components/rewards/InviteFriends";
import RewardCard from "@/components/rewards/RewardCard";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const modalAnimation = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const [tokenRewards, setTokenRewards] = useState<TokenReward[]>([
    {
      id: "reward1",
      title: "Token Reward",
      description: "Use ₦20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
    {
      id: "reward2",
      title: "Token Reward",
      description: "Use ₦20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
    {
      id: "reward3",
      title: "Token Reward",
      description: "Use ₦20 today to unlock your first reward!",
      progress: 80,
      goal: 12,
      current: 20,
    },
  ]);

  const handleRewardHistoryPress = () => {
    setShowModal(true);
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
    });
  };

  const handleInviteFriends = async () => {
    // try {
    //   const result = await Share.share({
    //     message:
    //       "Join me on Lightly! Save energy and earn rewards. Use my referral code: LIGHTLY123",
    //   });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //       Alert.alert("Success", "Invitation sent successfully!");
    //     } else {
    //       // shared
    //       Alert.alert("Success", "Invitation sent successfully!");
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Could not share the invitation");
    // }
    router.push("/(profile)/invite-friends");
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
      <Modal
        visible={showModal}
        animationType="none"
        transparent
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalAnimation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reward History</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  padding: 4,
                  borderRadius: "100%",
                  borderColor: "#878787",
                }}
                onPress={closeModal}
              >
                <Ionicons name="close" size={24} color="#878787" />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={true}
              style={styles.rewardsScrollView}
              contentContainerStyle={styles.rewardsScrollContent}
            >
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
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 40,
  },
  rewardsScrollView: {
    maxHeight: 550,
  },
  rewardsScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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

  modalTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
    marginBottom: 24,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#022322",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "InterBold",
    color: "#fff",
  },
});
