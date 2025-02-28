"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SerialNumberScreen({ next }: { next: () => void }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [checkedSteps, setCheckedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
  });

  const toggleStep = (step) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleContinue = () => {
    if (serialNumber.length === 4) {
      next();
      console.log(serialNumber);
      // Navigate to next screen or handle submission
      // navigation.navigate('NextScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Let's be sure you {"\n"}found the right {"\n"} distribution box
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/box.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.subtitle}>How to find your serial number</Text>

        <View style={styles.stepsContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.stepRow}
            onPress={() => toggleStep("step1")}
          >
            <Ionicons
              name={checkedSteps.step1 ? "checkbox" : "square-outline"}
              size={24}
              color={checkedSteps.step1 ? "#002020" : "#878787"}
            />
            <Text style={styles.stepText}>
              Find your distribution box package
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.stepRow}
            onPress={() => toggleStep("step2")}
          >
            <Ionicons
              name={checkedSteps.step2 ? "checkbox" : "square-outline"}
              size={24}
              color={checkedSteps.step2 ? "#002020" : "#878787"}
            />
            <Text style={styles.stepText}>
              Look at the back of your box package for the serial number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.stepRow}
            onPress={() => toggleStep("step3")}
          >
            <Ionicons
              name={checkedSteps.step3 ? "checkbox" : "square-outline"}
              size={24}
              color={checkedSteps.step3 ? "#002020" : "#878787"}
            />
            <Text style={styles.stepText}>
              Enter the "5 digit code" with serial number as heading in the
              below input field
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Serial number</Text>
          <TextInput
            style={[
              styles.input,
              serialNumber.length === 4 && { borderColor: "#28A745" },
            ]}
            placeholder="Enter serial number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            maxLength={5}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.continueButton,
            serialNumber.length === 4 && styles.continueButtonActive,
          ]}
          onPress={handleContinue}
          disabled={serialNumber.length !== 4}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 24,
  },
  imageContainer: {
    width: width - 80,
    height: width - 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 24,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: "InterRegular",
    color: "#022322",
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 8,
  },
  input: {
    height: 48,
    fontFamily: "InterRegular",
    borderWidth: 1,
    borderColor: "#d6d6d6",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#022322",
  },
  continueButton: {
    backgroundColor: "#e6e9e9",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonActive: {
    backgroundColor: "#022322",
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#FFFFFF",
  },
});
