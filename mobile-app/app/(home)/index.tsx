import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/home/Header";
import PowerUsage from "@/components/home/PowerUsage";
import AlertCarousel from "@/components/home/AlertCarousel";
import PowerUsageSection from "@/components/home/PowerUsageSection";
import RewardSection from "@/components/home/RewardSection";
import MoodModal from "@/components/modals/MoodModal";
import { useReadings } from "@/context/ReadingsContext";

export default function HomeScreen() {
  const [showMood, setShowMood] = useState(false)
  const { readings } = useReadings();


  const handleMoodModalClose = () => {
    setShowMood(false);
  };
  
  
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Header setShowMood={setShowMood} />

        {/* Power Usage */}
        <PowerUsage bill={readings[0]?.bill || 0} totalEnergy={Number(readings[0]?.total_energy.toFixed(2)) || 0} />

        {/* Alert Carousel */}
        <AlertCarousel />

        {/* Power Usages */}
        <PowerUsageSection />

        {/* Earn Rewards */}
        {/* <RewardSection /> */}

        <MoodModal visible={showMood} onClose={handleMoodModalClose} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  powerUsageSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#696969",
    marginBottom: 10,
  },
  powerUsageAmount: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 36,
    fontWeight: "700",
    color: "#022322",
  },
  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#022322",
  },
  unit: {
    fontSize: 16,
    color: "#696969",
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  increaseIndicator: {
    backgroundColor: "#f4c0c5",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  comparisonText: {
    fontSize: 14,
    color: "#dc3545",
  },
  alertCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  alertTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  alertText: {
    fontSize: 16,
    color: "#022322",
    lineHeight: 22,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 30,
  },
  saveEnergyButton: {
    backgroundColor: "#ff671f",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveEnergyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  usagesSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: "#696969",
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomEmoji: {
    fontSize: 20,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsage: {
    fontSize: 14,
    color: "#696969",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  rewardsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  rewardsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  rewardCard: {
    width: 280,
    height: 100,
    backgroundColor: "#022322",
    borderRadius: 12,
    marginRight: 15,
    padding: 16,
    justifyContent: "center",
  },
  rewardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
  },
  rewardDescription: {
    fontSize: 14,
    color: "#8b9a99",
    width: 200,
  },
  coinImage: {
    width: 40,
    height: 40,
  },
  bottomPadding: {
    height: 80,
  },
});
