import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { user } = useAuth();



  const formatString = (str: string) => {
    if (str.length > 10) {
      return str.substring(0, 8) + "...";
    }
    return str;
  };

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#8b9a99" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hey there!</Text>
          <Text style={styles.condoName}>{user?.condo_name || "User"} Condo</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.lightSavingsButton}>
        <Ionicons name="bulb-outline" size={18} color="#28a745" />
        <Text style={styles.lightSavingsText}>
          {formatString("Light savings")}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#8b9a99" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e4e4e4",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#ff671f",
    fontFamily: "InterRegular",
  },
  condoName: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  lightSavingsButton: {
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lightSavingsText: {
    fontSize: 14,
    color: "#022322",

    marginHorizontal: 5,
    fontFamily: "InterRegular",
  },
});

export default Header;
