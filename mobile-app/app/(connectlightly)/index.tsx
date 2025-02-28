"use client";

import { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConnectToBox from "@/screens/ConnectToBox";
import SerialNumber from "@/screens/SerialNumber";
import WifiConnection from "@/screens/WifiConnection";
import PersonalizHome from "@/screens/PersonalizeHome";
import Stepper from "@/components/StepperTab";
import CubeSvg from "@/assets/icons/3d-cube-scan.svg";
import Document from "@/assets/icons/document-text.svg";
import DocumentActive from "@/assets/icons/document-text-active.svg";
import DocumentComplete from "@/assets/icons/document-text-complete.svg";
import Wifi from "@/assets/icons/wifi.svg";
import WifiComplete from "@/assets/icons/wifi-complete.svg";

// Step screen components
const CameraSetup = () => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Camera Setup</Text>
    <Text style={styles.stepDescription}>Configure your camera settings</Text>
  </View>
);

const DocumentUpload = () => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Document Upload</Text>
    <Text style={styles.stepDescription}>Upload required documents</Text>
  </View>
);

const WifiSetup = () => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>WiFi Setup</Text>
    <Text style={styles.stepDescription}>Connect to WiFi network</Text>
  </View>
);

const Complete = () => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Complete</Text>
    <Text style={styles.stepDescription}>Complete the setup process</Text>
  </View>
);

export default function ConnectToLightly() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: "1",
      icon: (
        <View style={styles.customIcon}>
          <CubeSvg />
        </View>
      ),
    },
    {
      id: "2",
      icon: (
        <View style={styles.customIcon}>
          {currentStep === 1 ? (
            <DocumentActive />
          ) : currentStep > 1 ? (
            <DocumentComplete />
          ) : (
            <Document />
          )}
        </View>
      ),
    },
    {
      id: "3",
      icon: (
        <View style={styles.customIcon}>
          {currentStep === 2 ? (
            <Wifi />
          ) : currentStep > 2 ? (
            <WifiComplete />
          ) : (
            <Wifi />
          )}
        </View>
      ),
    },
    {
      id: "4",
      icon: (
        <View style={styles.customIcon}>
          <Ionicons
            name={
              currentStep >= 3 ? "checkmark-circle" : "checkmark-circle-outline"
            }
            size={24}
            color={currentStep >= 3 ? "#004D40" : "#9E9E9E"}
          />
        </View>
      ),
    },
  ];

  const handleStepPress = (stepIndex: number) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ConnectToBox next={handleNext} />;
      case 1:
        return <SerialNumber next={handleNext} />;
      case 2:
        return <WifiConnection next={handleNext} />;
      case 3:
        return <PersonalizHome next={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepPress={handleStepPress}
        activeColor="#004D40"
        inactiveColor="#9E9E9E"
        lineColor="#E0E0E0"
        lineActiveColor="#004D40"
      />

      <View style={styles.content}>{renderStepContent()}</View>

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.backButton,
            currentStep === 0 && styles.disabledButton,
          ]}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            currentStep === steps.length - 1 && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepContent: {
    alignItems: "center",
  },
  customIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#E0E0E0",
  },
  nextButton: {
    backgroundColor: "#004D40",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
