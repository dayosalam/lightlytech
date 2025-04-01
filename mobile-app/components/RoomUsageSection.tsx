import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import RoomUsageItem from "./RoomUsageItem";
import { useState } from "react";
import SaveRecommendationCard from "./SaveRecommendationCard";
import smiley from "@/assets/images/smiley.png";
import wink from "@/assets/images/wink.png";
import chess from "@/assets/images/chess.png";

const RoomUsageSection = () => {
  const [selectedRoomFilter, setSelectedRoomFilter] =
    useState("Most consuming");
  return (
    <View style={styles.roomsContainer}>
      <View style={styles.roomsHeader}>
        <Text style={styles.roomsTitle}>Rooms usage</Text>
        <TouchableOpacity style={styles.roomsFilterButton}>
          <Text style={styles.roomsFilterText}>{selectedRoomFilter}</Text>
          <Ionicons name="chevron-down" size={18} color="#8b9a99" />
        </TouchableOpacity>
      </View>

      {/* Room Items */}
      <RoomUsageItem
        icon={smiley}
        roomName="Living room"
        usageBreakdown="Light: 20% · Socket: 80%"
        usagePercentage={52}
        price="₦1223"
      />
      <RoomUsageItem
        icon={wink}
        roomName="Room 1"
        usageBreakdown="Light: 20% · Socket: 80%"
        usagePercentage={52}
        price="₦1223"
      />
      <RoomUsageItem
        icon={chess}
        roomName="Restroom (Room 1)"
        usageBreakdown="Light: 20% · Socket: 80%"
        usagePercentage={52}
        price="₦1223"
      />
      <RoomUsageItem
        icon={chess}
        roomName="Restroom (Room 1)"
        usageBreakdown="Light: 20% · Socket: 80%"
        usagePercentage={52}
        price="₦1223"
      />

      {/* Recommendations */}
      <SaveRecommendationCard />
    </View>
  );
};

export default RoomUsageSection;

const styles = StyleSheet.create({
  roomsContainer: {
    marginTop: 20,
    // paddingHorizontal: 30,

    marginBottom: 10,
  },
  roomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roomsTitle: {
    fontSize: 22,
    fontFamily: "InterBold",
    color: "#022322",
  },
  roomsFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roomsFilterText: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#022322",
    marginRight: 4,
  },
});
