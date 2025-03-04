import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AlertCardProps {
  message: string;
  emoji: string;
}

const AlertCard = ({ message, emoji }: AlertCardProps) => {
  const handleSaveEnergy = () => {
    // Implement save energy action
    console.log("Save energy pressed");
  };

  return (
    <View style={styles.alertCard}>
      <View style={styles.alertContent}>
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertText}>{message}</Text>
        </View>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.saveEnergyButton}
        onPress={handleSaveEnergy}
      >
        <Text style={styles.saveEnergyText}>Save energy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 5,
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
    fontFamily: "InterRegular",
    lineHeight: 22,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 35,
  },
  saveEnergyButton: {
    backgroundColor: "#FF671F",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveEnergyText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "InterSemiBold",
  },
});

export default AlertCard;
