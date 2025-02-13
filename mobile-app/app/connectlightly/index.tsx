import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#C4C4C4",
    borderRadius: 40,
    marginBottom: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C4C4C4",
  },
  stepDotActive: {
    backgroundColor: "#222",
  },
  text: {
    fontFamily: "InterRegular",
    fontSize: 16,
  },
  stepTitle: {
    fontFamily: "InterSemiBold",
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    paddingHorizontal: 20,
    width: 350,
    borderRadius: 20,
    marginBottom: 10,
  },
  nextButton: {
    width: 350,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: "InterBold",
    color: "#FFF",
  },
  wifiContainer: {
    flexDirection: "column",
    width: 365,
    alignItems: "center",
  },
  connectButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  connectButtonText: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#FFF",
  },
  wifiRow: {
    flexDirection: "row",
    width: 300,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  wifiInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  wifiInputIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  wifiName: {
    fontSize: 12,
    fontFamily: "InterBold",
    marginBottom: 10,
    color: "#1E2124",
    alignSelf: "flex-start",
  },
  wifiPassword: {
    fontSize: 12,
    fontFamily: "InterBold",
    color: "#1E2124",
    alignSelf: "flex-start",
  },
  wifiInput: {
    height: 40,
    backgroundColor: "white",
    paddingHorizontal: 20,
    width: 300,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    marginBottom: 10,
  },
  wifiButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  wifiButtonText: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#FFF",
  },
});

const RenderStep = ({ isActive }: { isActive: boolean }) => {
  return <View style={[styles.stepDot, isActive && styles.stepDotActive]} />;
};

const steps = [
  {
    id: 1,
    content: <Text style={styles.text}>Searching for Lightly Device</Text>,
  },
  {
    id: 2,
    content: (
      <View>
        <Text style={styles.stepTitle}>Enter Serial Number</Text>
        <TextInput style={styles.input} placeholder="Serial Number" />
      </View>
    ),
  },
  {
    id: 3,
    content: <Text style={styles.stepTitle}>Searching for WIFI</Text>,
  },
  {
    id: 4,
    content: (props: {
      onConnect: (ssid: string, password: string) => void;
    }) => <WiFiStep {...props} />,
  },
];

const WiFiStep = ({
  onConnect,
}: {
  onConnect: (ssid: string, password: string) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wifiContainer}>
      <Text style={styles.stepTitle}>Connect to WIFI</Text>

      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={styles.wifiRow}>
          <Text style={styles.text}>House Wifi {index + 1}</Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.wifiName}>WIFI Name</Text>
            <TextInput
              style={styles.wifiInput}
              placeholder="WIFI Name"
              value={ssid}
              onChangeText={setSsid}
            />
            <Text style={styles.wifiPassword}>Password</Text>
            <View style={styles.wifiInputContainer}>
              <TextInput
                style={styles.wifiInput}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.wifiInputIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={18}
                  color="#BBBCBE"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.wifiButton}
              onPress={() => {
                setModalVisible(false);
                onConnect(ssid, password);
              }}
            >
              <Text style={styles.wifiButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Index = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepPress = (step) => {
    setActiveStep((prevStep) => (step < 0 || step >= steps.length ? 0 : step));
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />

      <View style={styles.stepDots}>
        {steps.map((_, i) => (
          <RenderStep key={i} isActive={i === activeStep} />
        ))}
      </View>

      <View style={styles.content}>
        {typeof steps[activeStep].content === "function"
          ? steps[activeStep].content({
              onConnect: (ssid, password) => {
                console.log("Connected to:", ssid, password);
              },
            })
          : steps[activeStep].content}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => handleStepPress(activeStep + 1)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
