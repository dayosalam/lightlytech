import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PowerUsageChart from "../../components/PowerUsageChart";

const { width } = Dimensions.get("window");

const timeOptions = ["Today", "7 days", "1M", "1Y"];

export default function RoomDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [selectedTimeOption, setSelectedTimeOption] = useState("Today");
  const [isSocketOn, setIsSocketOn] = useState(true);
  const [isLightOn, setIsLightOn] = useState(true);

  // Mock data for the room
  const roomData = {
    name: "Living room",
    icon: "😊",
    iconBgColor: "#e7e4f9",
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
  const powerChartData = [500, 1200, 800, 1500, 2000, 1800, 2500];
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
            <Text style={styles.roomEmoji}>{roomData.icon}</Text>
            <View style={styles.editIconContainer}>
              <Ionicons name="pencil" size={20} color="#696969" />
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
        <View style={styles.usageBreakdownContainer}>
          <View style={styles.usageItem}>
            <Text style={styles.usageLabel}>Socket usage</Text>
            <Text style={styles.usageValue}>{roomData.socketUsage}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  styles.socketProgressBar,
                  { width: "70%" },
                ]}
              />
            </View>
          </View>

          <View style={styles.usageItem}>
            <Text style={styles.usageLabel}>Light usage</Text>
            <Text style={styles.usageValue}>{roomData.lightUsage}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  styles.lightProgressBar,
                  { width: "45%" },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Control switches */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlCard}>
            <Text style={styles.controlLabel}>Socket switch</Text>
            <Switch
              value={isSocketOn}
              onValueChange={setIsSocketOn}
              trackColor={{ false: "#d6d6d6", true: "#b1bbba" }}
              thumbColor={isSocketOn ? "#28a745" : "#f4f3f4"}
              ios_backgroundColor="#d6d6d6"
            />
          </View>

          <View style={styles.controlCard}>
            <Text style={styles.controlLabel}>Light switch</Text>
            <Switch
              value={isLightOn}
              onValueChange={setIsLightOn}
              trackColor={{ false: "#d6d6d6", true: "#b1bbba" }}
              thumbColor={isLightOn ? "#28a745" : "#f4f3f4"}
              ios_backgroundColor="#d6d6d6"
            />
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  roomEmoji: {
    fontSize: 34,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
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
  usageBreakdownContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 25,
    justifyContent: "space-between",
  },
  usageItem: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  usageLabel: {
    fontSize: 16,
    color: "#696969",
    marginBottom: 5,
    fontFamily: "InterRegular",
  },
  usageValue: {
    fontSize: 20,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  socketProgressBar: {
    backgroundColor: "#8B4513",
  },
  lightProgressBar: {
    backgroundColor: "#696969",
  },
  controlsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 25,
    justifyContent: "space-between",
  },
  controlCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  controlLabel: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
});
