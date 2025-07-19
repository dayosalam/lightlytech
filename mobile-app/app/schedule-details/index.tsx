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

const { width } = Dimensions.get("window");

const timeOptions = ["Today", "7 days", "1M", "1Y"];

export default function RoomDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);

  // Mock data for the room
  const roomData = {
    name: "Baddies Condo",
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

  // Mock data for rooms
  const rooms = [
    {
      id: "1",
      name: "Living room 2",
      emoji: "🌿",
      backgroundColor: "#E8F5E9",
      lights: {
        status: "off",
        time: "19:00-12:00",
      },
      sockets: {
        status: "off",
        time: "19:00-12:00",
      },
    },
    {
      id: "2",
      name: "Living room 2",
      emoji: "🌿",
      backgroundColor: "#E8F5E9",
      lights: {
        status: "off",
        time: "19:00-12:00",
      },
      sockets: {
        status: "off",
        time: "19:00-12:00",
      },
    },
    {
      id: "3",
      name: "Living room 2",
      emoji: "🌿",
      backgroundColor: "#E8F5E9",
      lights: {
        status: "off",
        time: "19:00-12:00",
      },
      sockets: {
        status: "off",
        time: "19:00-12:00",
      },
    },
  ];

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

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
          </View>
          <Text style={styles.roomName}>{roomData.name}</Text>
        </View>

        {/* Expandable Room Cards */}
        <View style={styles.roomCardsContainer}>
          {rooms.map((room) => (
            <View key={room.id} style={styles.roomCardWrapper}>
              <TouchableOpacity
                style={styles.roomHeader}
                onPress={() => toggleRoomExpansion(room.id)}
              >
                <View style={styles.roomHeaderLeft}>
                  <View
                    style={[
                      styles.roomEmojiContainer,
                      { backgroundColor: room.backgroundColor },
                    ]}
                  >
                    <Text style={styles.roomEmoji}>{room.emoji}</Text>
                  </View>
                  <Text style={styles.roomHeaderText}>{room.name}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#ffff",
                    borderRadius: 20,
                    padding: 3,
                  }}
                >
                  <Ionicons
                    name={
                      expandedRooms.includes(room.id)
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#8B9A99"
                  />
                </View>
              </TouchableOpacity>

              {expandedRooms.includes(room.id) && (
                <View style={styles.expandedContent}>
                  <View style={styles.roomDetailsContainer}>
                    <View style={styles.deviceRow}>
                      <View style={styles.deviceInfo}>
                        <Ionicons
                          name="bulb-outline"
                          size={22}
                          color="#022322"
                        />
                        <Text style={styles.deviceText}>Lights</Text>
                      </View>
                      <View style={styles.deviceStatus}>
                        <Text style={styles.deviceStatusText}>
                          Switch {room.lights.status} · {room.lights.time}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.deviceSeparator} />

                    <View style={styles.deviceRow}>
                      <View style={styles.deviceInfo}>
                        <Ionicons
                          name="flash-outline"
                          size={22}
                          color="#022322"
                        />
                        <Text style={styles.deviceText}>Sockets</Text>
                      </View>
                      <View style={styles.deviceStatus}>
                        <Text style={styles.deviceStatusText}>
                          Switch {room.sockets.status} · {room.sockets.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
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
    paddingBottom: 100, // Add padding to account for the bottom tabs
    paddingHorizontal: 16,
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
    fontSize: 18,
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
  roomCardsContainer: {
    marginTop: 20,
  },
  roomCardWrapper: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  roomHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomEmojiContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomHeaderText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  roomDetailsContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  expandedContent: {
    backgroundColor: "#FFFFFF",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  deviceSeparator: {
    height: 4,

    backgroundColor: "#F0F0F0",
    marginHorizontal: 0,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginLeft: 12,
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceStatusText: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
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
});
