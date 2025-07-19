import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const PowerUsageSection = () => {
  const [isLivingRoomOn, setIsLivingRoomOn] = useState(true);
  const [isRoom1On, setIsRoom1On] = useState(true);
  const [isRestroomOn, setIsRestroomOn] = useState(true);

  const router = useRouter();

  const usages = [
    {
      id: "1",
      name: "Living Room",
      icon: "😊",
      iconBgColor: "#e7e4f9",
      usage: "₦12/9Kw/H • 52% usage",
    },
    {
      id: "2",
      name: "Room 1",
      icon: "😉",
      iconBgColor: "#e7e4f9",
      usage: "₦12/9Kw/H • 52% usage",
    },
    {
      id: "3",
      name: "Restroom",
      icon: "♟️",
      iconBgColor: "#e7e4f9",
      usage: "₦12/9Kw/H • 52% usage",
    },
  ];

  const handleRoomDetails = (id: string) => {
    // Navigate to the room details screen
    requestAnimationFrame(() => {
      router.push(`/room?id=${id}`);
    });
  };

  return (
    <View style={styles.usagesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Power usages</Text>
        {/* <TouchableOpacity>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity> */}
      </View>

      {usages.map(({ id, name, icon, iconBgColor, usage }) => (
        <View key={id} style={styles.roomItem}>
          <View style={styles.roomInfo}>
            <View
              style={[
                styles.roomIconContainer,
                { backgroundColor: iconBgColor },
              ]}
            >
              <Text style={styles.roomEmoji}>{icon}</Text>
            </View>
            <View style={styles.roomDetails}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleRoomDetails(id)}
              >
                <Text style={styles.roomName}>{name}</Text>
              </TouchableOpacity>
              <Text style={styles.roomUsage}>{usage}</Text>
            </View>
          </View>
          <Switch
            value={isLivingRoomOn}
            onValueChange={setIsLivingRoomOn}
            trackColor={{ false: "#d6d6d6", true: "#b1bbba" }}
            thumbColor={isLivingRoomOn ? "#28a745" : "#f4f3f4"}
            ios_backgroundColor="#d6d6d6"
            style={styles.switch}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  usagesSection: {
    marginTop: 20,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
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
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
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
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsage: {
    fontSize: 14,
    color: "#878787",
    fontFamily: "InterRegular",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default PowerUsageSection;
