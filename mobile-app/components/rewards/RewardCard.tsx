import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useState } from "react";
import Token from "@/assets/icons/points.svg";

interface RewardCardProps {
  title: string;
  description: string;
  progress: number;
  goal: number;
  current: number;
}

const RewardCard = ({
  title,
  description,
  progress,
  goal,
  current,
}: RewardCardProps) => {
  // Calculate percentage for progress bar
  const percentage = Math.min(100, (progress / 100) * 100);

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${percentage}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              Goal N{goal} / N{current}
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Token />
        </View>
      </View>
      <Text style={styles.progressPercentage}>{progress}/100%</Text>
    </View>
  );
};

export default RewardCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#8b9a99",
    marginBottom: 12,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#022322",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "InterSemiBold",
    color: "#8b9a99",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tokenIcon: {
    width: 32,
    height: 32,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#34C759",
    textAlign: "right",
    marginTop: 8,
  },
});
