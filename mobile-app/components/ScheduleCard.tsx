import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface ScheduleCardProps {
  schedule: {
    id: string;
    name: string;
    icon: JSX.Element;
    switch: boolean;
    time: string;
  };
}

const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const switchStatus = schedule.switch ? "on" : "off";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {schedule.icon}
        <Text style={styles.name}>{schedule.name}</Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Switch {switchStatus}</Text>
        <Text style={styles.time}>{schedule.time}</Text>
      </View>
    </View>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  icon: {
    fontSize: 20,
    color: "#022322",
  },
  name: {
    fontSize: 16,
    color: "#022322",
    fontFamily: "InterSemiBold",
  },
  switchContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  switchText: {
    fontSize: 16,
    color: "#878787",
    fontFamily: "InterRegular",
  },
  time: {
    fontSize: 16,
    color: "#878787",
    fontFamily: "InterRegular",
  },
});
