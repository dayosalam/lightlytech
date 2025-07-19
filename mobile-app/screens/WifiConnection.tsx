import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Wifi from "@/assets/icons/wifi-complete.svg";
import { Ionicons } from "@expo/vector-icons";
import { useWifi } from "@/context/WifiContext";
import { sendWifiCredentials } from "@/api/wifi";

const { width } = Dimensions.get("window");

const CustomSpinner = () => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.spinnerContainer}>
      <Animated.View
        style={[styles.spinnerWrapper, { transform: [{ rotate: spin }] }]}
      >
        <Svg height="30" width="30" viewBox="0 0 48 48">
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#FF5722"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            opacity={0.3}
          />
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#FF5722"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="110 30"
            transform="rotate(-90, 24, 24)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default function WifiConnection({ next }: { next: () => void }) {
  const {
    networks,
    isScanning,
    error,
    connectToNetwork,
    scanNetworks,
    currentSSID,
  } = useWifi();
  const [wifiNetworks, setWifiNetworks] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedWifi, setSelectedWifi] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isHiddenNetwork, setIsHiddenNetwork] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Convert networks from WifiContext to just SSIDs for the UI
  useEffect(() => {
    if (networks && networks.length > 0) {
      // Filter out the "Lightly Box" WiFi and extract SSIDs
      const filteredNetworks = networks
        .filter((network) => network.SSID !== "Lightly Box")
        .map((network) => network.SSID);

      setWifiNetworks(filteredNetworks);

      if (filteredNetworks.length > 0 && !modalVisible) {
        setModalVisible(true);
      } else if (
        filteredNetworks.length === 0 &&
        currentSSID === "Lightly Box" &&
        !modalVisible
      ) {
        // If we're connected to Lightly Box but can't see other networks, still show the modal
        setModalVisible(true);
      }
    } else if (currentSSID === "Lightly Box" && !modalVisible) {
      // If we're connected to Lightly Box but have no networks, still show the modal
      setModalVisible(true);
    }
  }, [networks, currentSSID]);

  // Use the scanNetworks function from the WiFi context
  const scanForWifiNetworks = async () => {
    setConnectionError("");
    await scanNetworks();

    // Update connection error from context if needed
    if (error) {
      setConnectionError(error);
    }
  };

  // Use the connectToNetwork function from the WiFi context
  const connectToWifi = async (ssid: string, password: string) => {
    try {
      setConnectionError("");

      // Use the context function to connect
      const connected = await connectToNetwork(ssid, password, isHiddenNetwork);

      if (connected) {
        console.log(`Successfully connected to ${ssid}`);
        next();
      } else {
        // Error will be set in the context, but we can also set it locally
        if (error) {
          setConnectionError(error);
        } else {
          setConnectionError(
            "Failed to connect to the network. Please check your password and try again."
          );
        }
      }
    } catch (err) {
      console.log("Error connecting to WiFi:", err);
      setConnectionError("Error connecting to the network");
    }
  };

  useEffect(() => {
    // Start scanning for WiFi networks when component mounts
    scanForWifiNetworks();
  }, []);

  // Update connection error from context when it changes
  useEffect(() => {
    if (error) {
      setConnectionError(error);
    }
  }, [error]);

  console.log("Current SSID:", currentSSID);

  const handleConnect = async () => {
    // Validate that we have a valid SSID (not "manual") and password
    if (selectedWifi && selectedWifi !== "manual" && password) {
      console.log("Selected WiFi:", selectedWifi);
      console.log("Password:", password);
      console.log("Hidden network:", isHiddenNetwork);

      try {
        await sendWifiCredentials(selectedWifi, password);
        // Show success message
        setConnectionError("");
        alert(
          "WiFi credentials sent to Lightly Box. It will now attempt to connect."
        );
        next();
      } catch (error) {
        console.error("Failed to send WiFi credentials:", error);
        setConnectionError(
          "Failed to send WiFi credentials to the Lightly Box. Please try again."
        );
      }
    } else if (selectedWifi === "manual" && password.length < 6) {
      setConnectionError(
        "Please enter a valid password (at least 6 characters)."
      );
    } else {
      setConnectionError("Please enter both WiFi name and password.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect to a WiFi</Text>
          <Text style={styles.subtitle}>
            Let's pair the distribution box and your {"\n"} phone to your WiFi
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/box.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.spinnerWrapper}>
          <CustomSpinner />
          <Text style={styles.searchingText}>
            {isScanning ? "Scanning for WiFi networks..." : "Ready to connect"}
          </Text>
          {connectionError ? (
            <Text style={styles.errorText}>{connectionError}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanForWifiNetworks}
          >
            <Text style={styles.scanButtonText}>Scan for Networks</Text>
          </TouchableOpacity>

          {connectionError && connectionError.includes("Location Services") && (
            <TouchableOpacity
              style={[
                styles.scanButton,
                { backgroundColor: "#4285F4", marginTop: 8 },
              ]}
              onPress={() => {
                // Open device location settings
                // This requires the react-native-android-settings-library package
                // but for now we'll just alert the user
                alert(
                  "Please enable Location Services in your device settings, then come back and tap 'Scan for Networks'"
                );
              }}
            >
              <Text style={styles.scanButtonText}>Open Location Settings</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal for WiFi List */}
      <Modal
        animationType="none"
        statusBarTranslucent={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedWifi
                  ? `Connect to ${selectedWifi}`
                  : "Select WiFi network"}
              </Text>
              <Ionicons
                name="close-circle"
                size={24}
                color="black"
                onPress={() => setModalVisible(false)}
              />
            </View>
            {/* Add a button to manually enter WiFi details */}
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setSelectedWifi("manual")}
            >
              <Text style={styles.manualEntryText}>
                Can't see your network? Enter details manually
              </Text>
            </TouchableOpacity>

            {selectedWifi ? (
              <View>
                <Text style={styles.selectedWifiText}>
                  {selectedWifi === "manual"
                    ? "Enter your WiFi details:"
                    : `Enter password for ${selectedWifi}:`}
                </Text>

                {selectedWifi === "manual" && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="WiFi Network Name (SSID)"
                      value={selectedWifi === "manual" ? "" : selectedWifi}
                      onChangeText={(text) =>
                        setSelectedWifi(text !== "manual" ? text : "manual")
                      }
                      autoCapitalize="none"
                      placeholderTextColor="#878787"
                    />
                  </View>
                )}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="WiFi Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#878787"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#878787"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setIsHiddenNetwork(!isHiddenNetwork)}
                  >
                    {isHiddenNetwork && (
                      <View style={styles.checkboxSelected} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    This is a hidden network
                  </Text>
                </View>

                {connectionError ? (
                  <Text style={styles.errorText}>{connectionError}</Text>
                ) : null}

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.continueButton,
                    password.length > 6 && styles.continueButtonActive,
                  ]}
                  onPress={handleConnect}
                  disabled={!password || password.length < 6}
                >
                  <Text style={styles.continueButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={wifiNetworks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.wifiItem}
                    onPress={() => setSelectedWifi(item)}
                  >
                    <View style={styles.wifiItemContainer}>
                      <Text style={styles.wifiText}>{item}</Text>
                      <Wifi width={24} height={24} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  manualEntryButton: {
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  manualEntryText: {
    color: "#FF5722",
    fontFamily: "InterSemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#022322",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    backgroundColor: "#022322",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  spinnerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontFamily: "InterRegular",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  scanButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: "center",
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: "100%",
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
    color: "#022322",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wifiItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  findNetworkButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 10,
  },
  header: {
    gap: 8,
    marginBottom: 24,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
    // alignItems: 'center',
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontFamily: "InterBold",
    color: "#022322",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#878787",
    lineHeight: 24,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 48,
  },
  selectedWifiText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    fontFamily: "InterRegular",
    padding: 10,
    color: "#000000",
  },
  passwordContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontFamily: "InterRegular",
    color: "#000000",
  },
  eyeIcon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: width - 80,
    height: width - 80,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  spinnerWrapper: {
    alignItems: "center",
    gap: 16,
  },
  searchingText: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#878787",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 20,
    marginVertical: 7,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 10,
  },
  wifiItem: {
    paddingVertical: 15,
  },
  wifiText: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#022322",
    fontSize: 16,
    fontFamily: "InterSemiBold",
  },
});
