import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const MOODS: Record<number, { label: string; emoji: string }> = {
  1: { label: "Light Savings", emoji: "💡" },
  2: { label: "Out to work", emoji: "🏢" },
  3: { label: "Chilling", emoji: "😎" },
  4: { label: "Party Mode", emoji: "🎉" },
  // Add more moods as needed
};

const Header = ({ setShowMood }: { setShowMood: (value: boolean) => void }) => {
  const { user } = useAuth();

  const formatString = (str: string) => {
    if (str.length > 10) {
      return str.substring(0, 8) + "...";
    }
    return str;
  };

  const moodInfo = user?.mood ? MOODS[user.mood] : MOODS[1];

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.emoji ? (
            <Text style={styles.emoji}>{user.emoji}</Text>
          ) : (
            <Ionicons name="person" size={24} color="#8b9a99" />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hey there!</Text>
          <Text style={styles.condoName}>{user?.condo_name || "User"}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.lightSavingsButton}
        onPress={() => setShowMood(true)}
      >
        <Text style={styles.emoji}>{moodInfo.emoji}</Text>
        <Text style={styles.lightSavingsText}>
          {formatString(moodInfo.label)}
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
  emoji: {
    fontSize: 16,
    color: "#022322",
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
    shadowColor: "#000",
    backgroundColor: "#f5f5f5",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
  },
  lightSavingsText: {
    fontSize: 14,
    color: "#022322",
    marginLeft: 6,
    marginRight: 4,
    fontFamily: "InterRegular",
    fontWeight: "500",
  },
});

export default Header;
