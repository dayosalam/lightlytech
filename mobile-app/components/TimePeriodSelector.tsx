import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

interface TimePeriodSelectorProps {
  selectedTimeOption: string;
  setSelectedTimeOption: (option: string) => void;
  options: string[];
}

const TimePeriodSelector = ({
  selectedTimeOption,
  setSelectedTimeOption,
  options,
}: TimePeriodSelectorProps) => {
  return (
    <View style={styles.timeSelector}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.timeOption,
            selectedTimeOption === option && styles.selectedTimeOption,
          ]}
          onPress={() => setSelectedTimeOption(option)}
        >
          <Text
            style={[
              styles.timeOptionText,
              selectedTimeOption === option && styles.selectedTimeOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TimePeriodSelector;
