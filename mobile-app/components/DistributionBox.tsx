import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Cube from "@/assets/icons/3d-cube-white.svg";

const DistributionBox = ({ onClick }: { onClick: () => void }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
      <View style={styles.cubeContainer}>
        <Cube />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cubeContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Half of width/height
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF671F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
});

export default DistributionBox;
