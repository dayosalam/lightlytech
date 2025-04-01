import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import UsageBreakdownCard from "../../components/UsageBreakdownCard";
import { Svg, Path, Circle, Line } from "react-native-svg";
import AverageUsage from "@/components/AverageUsage";
import RoomUsageItem from "@/components/RoomUsageItem";
import RoomUsageSection from "@/components/RoomUsageSection";
import PowerUsageChart from "@/components/PowerUsageChart";

// Tab options for time period selection
const timeOptions = ["Today", "1 M", "1 Y", "All time"];

export default function InsightsScreen() {
  const [selectedTimeOption, setSelectedTimeOption] = useState("Today");
  const [selectedRoomFilter, setSelectedRoomFilter] =
    useState("Most consuming");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Time period tabs */}
        <View style={styles.tabContainer}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.tabButton,
                selectedTimeOption === option && styles.selectedTabButton,
              ]}
              onPress={() => setSelectedTimeOption(option)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTimeOption === option && styles.selectedTabText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Power Usage Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Power usage</Text>
          <View style={styles.powerUsageContainer}>
            <View style={styles.powerUsageHeader}>
              <View>
                <Text style={styles.powerUsageValue}>₦8,008.04</Text>
                <Text style={styles.powerUsageUnit}>11.89kWh</Text>
              </View>
            </View>

            <Text style={styles.powerUsageIncrease}>
              <Ionicons name="arrow-up" size={12} color="#FF3B30" /> Using up
              12% power more than last year
            </Text>

            {/* Power Usage Graph */}
            <PowerUsageChart />
          </View>
        </View>

        {/* Socket and Light Usage */}
        <UsageBreakdownCard
          socketUsage="713kWh"
          lightUsage="4.76kWh"
          socketPercentage={60}
          lightPercentage={40}
          containerStyle={styles.usageBreakdownCard}
        />

        {/* Average Usage */}
        <AverageUsage />

        {/* Rooms Usage Section */}
        <RoomUsageSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  selectedTabButton: {
    backgroundColor: "#022322",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "#022322",
  },
  selectedTabText: {
    color: "#FFFFFF",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#696969",
    marginBottom: 8,
  },
  powerUsageContainer: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  powerUsageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  powerUsageValue: {
    fontSize: 30,
    fontFamily: "InterBold",
    color: "#022322",
  },
  powerUsageUnit: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#696969",
  },
  powerUsageTooltip: {
    backgroundColor: "#022322",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  tooltipValue: {
    fontSize: 14,
    fontFamily: "InterBold",
    color: "#FFFFFF",
  },
  tooltipUnit: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#FFFFFF",
  },
  powerUsageIncrease: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#FF3B30",
    marginBottom: 16,
  },
  graphContainer: {
    marginTop: 8,
  },
  graphLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  graphLabel: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#696969",
  },
  usageBreakdownCard: {
    marginBottom: 16,
  },
  averageUsageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  averageUsageLabel: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#022322",
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
  roomsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  roomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roomsTitle: {
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#022322",
  },
  roomsFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roomsFilterText: {
    fontSize: 12,
    fontFamily: "InterMedium",
    color: "#022322",
    marginRight: 4,
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  roomItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roomIconText: {
    fontSize: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsageBreakdown: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#696969",
  },
  roomItemRight: {
    alignItems: "flex-end",
  },
  roomPrice: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsagePercentage: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#696969",
  },
  recommendationsContainer: {
    marginTop: 24,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#696969",
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#022322",
    marginRight: 16,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F9F1",
    alignItems: "center",
    justifyContent: "center",
  },
  createScheduleButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  createScheduleText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#FF671F",
  },
});
