import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Svg, Path } from "react-native-svg";

interface SaveRecommendationCardProps {
  onCreateSchedule?: () => void;
}

const SaveRecommendationCard = ({
  onCreateSchedule,
}: SaveRecommendationCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Save recommendations</Text>
          <Text style={styles.description}>
            Schedule your rooms to be energy-saving mode on peak hours
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/sewing-needle.png")} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onCreateSchedule}>
        <Text style={styles.buttonText}>Create schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#696969",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    lineHeight: 22,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFF0EB",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#FF671F",
  },
});

export default SaveRecommendationCard;
