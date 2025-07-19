import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StepperProps {
  steps: {
    id: string;
    icon: string | React.ReactNode;
    iconFamily?: "Ionicons" | "MaterialIcons" | "FontAwesome";
  }[];
  currentStep: number;
  onStepPress?: (stepIndex: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  lineColor?: string;
  lineActiveColor?: string;
  iconSize?: number;
}

const { width } = Dimensions.get("window");

// Calculate responsive width with minimum and maximum constraints
const getStepperWidth = () => {
  const minWidth = 280; // Minimum width for very small screens
  const maxWidth = 400; // Maximum width for very large screens
  const calculatedWidth = width - 40;

  if (calculatedWidth < minWidth) return minWidth;
  if (calculatedWidth > maxWidth) return maxWidth;
  return calculatedWidth;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepPress,
  activeColor = "#004D40",
  inactiveColor = "#9E9E9E",
  lineColor = "#E0E0E0",
  lineActiveColor = "#004D40",
  iconSize = 24,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress Line */}
      <View style={styles.lineContainer}>
        <View style={[styles.line, { backgroundColor: lineColor }]} />
        <View
          style={[
            styles.activeLine,
            {
              backgroundColor: lineActiveColor,
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Step Icons */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const iconColor = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepIconContainer,
                { borderColor: iconColor },
                isActive && { backgroundColor: "white" },
              ]}
              onPress={() => onStepPress && onStepPress(index)}
              disabled={!onStepPress}
            >
              {typeof step.icon === "string" ? (
                <Ionicons
                  name={step.icon as any}
                  size={iconSize}
                  color={iconColor}
                />
              ) : (
                step.icon
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: getStepperWidth(),
    height: Platform.OS === "ios" ? 70 : 60,
    justifyContent: "center",
    marginHorizontal: "auto",
    // marginTop: Platform.OS === "ios" ? 15 : 20,
    // marginBottom: Platform.OS === "ios" ? 20 : 15,
  },
  lineContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 35 : 30,
    left: 0,
    right: 0,
    height: 2,
  },
  line: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  activeLine: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 1.5,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width < 350 ? 5 : 10, // Less padding on smaller screens
  },
  stepIconContainer: {
    width: Platform.OS === "ios" ? 44 : 40,
    height: Platform.OS === "ios" ? 44 : 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Platform.OS === "ios" ? 22 : 20,
    // Add shadow for better visibility on different backgrounds
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Stepper;
