import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PowerUsageChart from "../../components/PowerUsageChart";
import UsageBreakdownCard from "../../components/UsageBreakdownCard";
import Edit from "@/assets/icons/edit.svg";

const { width } = Dimensions.get("window");

const timeOptions = ["Today", "7 days", "1M", "1Y"];

export default function RoomDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [selectedTimeOption, setSelectedTimeOption] = useState("Today");
  const [isSocketOn, setIsSocketOn] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [activeTab, setActiveTab] = useState("socket"); // Track active tab

  // Mock data for the room
  const roomData = {
    name: "Living room",
    icon: require("@/assets/images/smiley.png"),
    iconBgColor: "#D6E0FF",
    powerUsage: {
      cost: "₦8,008.04",
      energy: "11.89Kw/H",
      percentageChange: 12,
      isIncrease: true,
    },
    socketUsage: "7.13Kw/H",
    lightUsage: "4.76Kw/H",
  };

  // Mock chart data for power usage
  const powerChartData = [500, 1200, 800, 1500, 2000, 1800, 500];
  const powerChartLabels = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Room profile */}
        <View style={styles.roomProfile}>
          <View
            style={[
              styles.roomIconContainer,
              { backgroundColor: roomData.iconBgColor },
            ]}
          >
            <Image
              source={roomData.icon}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <View style={styles.editIconContainer}>
              <Edit width={26} height={26} />
            </View>
          </View>
          <Text style={styles.roomName}>{roomData.name}</Text>
        </View>

        {/* Time period selector */}
        <View style={styles.timeSelector}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.timeOption,
                selectedTimeOption === option && styles.selectedTimeOption,
              ]}
              onPress={() => setSelectedTimeOption(option)}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedTimeOption === option &&
                    styles.selectedTimeOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Power usage section */}
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
                name={
                  roomData.powerUsage.isIncrease ? "arrow-up" : "arrow-down"
                }
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

        {/* Power usage chart */}
        <PowerUsageChart
          data={powerChartData}
          labels={powerChartLabels}
          height={220}
          containerStyle={{ marginTop: 20 }}
        />

        {/* Usage breakdown */}
        <UsageBreakdownCard
          socketUsage="7.13Kw/H"
          lightUsage="4.76Kw/H"
          socketPercentage={60}
          lightPercentage={40}
          containerStyle={{ marginTop: 10 }}
        />
      </ScrollView>

      {/* Fixed bottom tab that sticks to the screen even when scrolled */}
      <View style={styles.fixedBottomTab}>
        <View style={styles.fixedTabContent}>
          {/* You can add your tab content here */}
          <View style={styles.switches}>
            <TouchableOpacity style={styles.switch}>
              <Text style={styles.switchLabel}>Socket switch</Text>
              <Switch
                value={isSocketOn}
                onValueChange={setIsSocketOn}
                trackColor={{ false: "#d6d6d6", true: "#28a745" }}
                thumbColor={"#ffffff"}
                ios_backgroundColor="#d6d6d6"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.switch}>
              <Text style={styles.switchLabel}>Light switch</Text>
              <Switch
                value={isLightOn}
                onValueChange={setIsLightOn}
                trackColor={{ false: "#d6d6d6", true: "#28a745" }}
                thumbColor={"#ffffff"}
                ios_backgroundColor="#d6d6d6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100, // Add padding to account for the bottom tabs
  },
  roomProfile: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  roomIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  roomEmoji: {
    fontSize: 34,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  roomName: {
    fontSize: 24,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginTop: 12,
  },
  timeSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTimeOption: {
    backgroundColor: "#F5F5F5",
    color: "#022322",
  },
  timeOptionText: {
    fontSize: 16,
    color: "#696969",
    fontFamily: "InterRegular",
  },
  selectedTimeOptionText: {
    color: "#022322",
    fontFamily: "InterSemiBold",
  },
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  increaseIndicator: {
    marginRight: 5,
  },
  comparisonText: {
    fontSize: 14,
    color: "#dc3545",
    fontFamily: "InterRegular",
  },
  tabsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  switches: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 8,
    width: "48%",
  },

  switchLabel: {
    fontSize: 16,
    color: "#022322",
    fontFamily: "InterBold",
    marginRight: 10,
  },
  tabContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContentTitle: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 10,
  },
  tabContentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#696969",
    fontFamily: "InterRegular",
  },
  fixedBottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  fixedTabContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
});
