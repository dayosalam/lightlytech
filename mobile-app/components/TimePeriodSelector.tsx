import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";

interface TimePeriodSelectorProps {
  selectedTimeOption: string;
  setSelectedTimeOption: (option: string) => void;
  options: string[];
  containerStyle?: StyleProp<ViewStyle>;
}

const TimePeriodSelector = ({
  selectedTimeOption,
  setSelectedTimeOption,
  options,
  containerStyle,
}: TimePeriodSelectorProps) => {
  return (
    <View style={[styles.timeSelector, containerStyle]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.timeOption,
            selectedTimeOption === option && styles.selectedTimeOption,
            index === options.length - 1 && { borderRightWidth: 0 },
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
    // marginHorizontal: 20,
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
    borderRightWidth: 1,
    borderRightColor: "#e4e4e4",
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
