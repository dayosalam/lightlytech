import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

const RoomUsageItem = ({
  icon,
  roomName,
  usageBreakdown,
  usagePercentage,
  price,
}: {
  icon: ImageSourcePropType;
  roomName: string;
  usageBreakdown: string;
  usagePercentage: number;
  price: string;
}) => {
  return (
    <View style={styles.roomItem}>
      <View style={styles.roomItemLeft}>
        <View style={styles.roomIcon}>
          <Image source={icon} />
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{roomName}</Text>
          <Text style={styles.roomUsageBreakdown}>{usageBreakdown}</Text>
        </View>
      </View>
      <View style={styles.roomItemRight}>
        <Text style={styles.roomPrice}>{price}</Text>
        <Text style={styles.roomUsagePercentage}>{usagePercentage}% usage</Text>
      </View>
    </View>
  );
};

export default RoomUsageItem;

const styles = StyleSheet.create({
  roomItem: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    width: width - 100,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  roomItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8E3DA",
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
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsageBreakdown: {
    fontSize: 14,
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
});
