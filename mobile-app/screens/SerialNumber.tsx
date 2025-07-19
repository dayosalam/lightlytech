"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function SerialNumberScreen({ next }: { next: () => void }) {
  const [serialNumber, setSerialNumber] = useState("");

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
      >
        <View style={styles.content}>
          <View style={styles.topSection}>
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
              <View style={styles.stepRow}>
                <Ionicons name="checkmark" size={24} color="#002020" />
                <Text style={styles.stepText}>
                  Find your distribution box package
                </Text>
              </View>

              <View style={styles.stepRow}>
                <Ionicons name="checkmark" size={24} color="#002020" />
                <Text style={styles.stepText}>
                  Look at the back of your box package for the serial number
                </Text>
              </View>

              <View style={styles.stepRow}>
                <Ionicons name="checkmark" size={24} color="#002020" />
                <Text style={styles.stepText}>
                  Enter the "5 digit code" with serial number as heading in the
                  below input field
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSection}>
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Platform.OS === "ios" ? 20 : 10,
    paddingTop: Platform.OS === "ios" ? 10 : 10,
    justifyContent: "space-between",
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 28 : 26,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 16,
    marginLeft: Platform.OS === "ios" ? 5 : 0,
  },
  imageContainer: {
    width: Platform.OS === "ios" ? width - 30 : width - 70,
    height: width - 250,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: "auto",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "InterRegular",
    color: "#022322",
    marginBottom: 12,
    marginLeft: Platform.OS === "ios" ? 16 : 0,
  },
  stepsContainer: {
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Platform.OS === "ios" ? 16 : 0,
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
    marginBottom: 16,
    width: Platform.OS === "ios" ? width - 50 : width - 70,
    marginHorizontal: "auto",
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 8,
  },
  input: {
    height: Platform.OS === "ios" ? 50 : 48,
    fontFamily: "InterRegular",
    borderWidth: 1,
    borderColor: "#d6d6d6",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#022322",
    backgroundColor: "#ffffff",
  },
  continueButton: {
    backgroundColor: "#e6e9e9",
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    borderRadius: 8,
    alignItems: "center",
    width: Platform.OS === "ios" ? width - 50 : width - 70,
    marginHorizontal: "auto",
  },
  continueButtonActive: {
    backgroundColor: "#022322",
  },
  continueButtonText: {
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontFamily: "InterSemiBold",
    color: "#FFFFFF",
  },
});
