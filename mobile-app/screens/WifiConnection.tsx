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
  PermissionsAndroid,
  Platform,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Wifi from "@/assets/icons/wifi-complete.svg";
import { Ionicons } from "@expo/vector-icons";
import WifiManager from "react-native-wifi-reborn";

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
  const [wifiNetworks, setWifiNetworks] = useState<string[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedWifi, setSelectedWifi] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [networks, setNetworks] = useState<string[] | undefined>([]);
  const [ssid, setSsid] = useState<string>("");
  const [isHiddenNetwork, setIsHiddenNetwork] = useState<boolean>(false);

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "We need your location to scan for WiFi networks",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  }, []);


  const checkLocationEnabled = async () => {
    try {
      // This is a workaround to check if location is enabled
      await WifiManager.getCurrentWifiSSID();
      return true;
    } catch (error) {
      // If error contains "Location service is turned off", then location is not enabled
      if (error instanceof Error && error.message.includes("Location service is turned off")) {
        return false;
      }
      // For other errors, assume location might be enabled
      return true;
    }
  };

  const scanForWifiNetworks = async () => {
    try {
      setScanning(true);
      setConnectionError("");
      
      // First check if location services are enabled
      const locationEnabled = await checkLocationEnabled();
      if (!locationEnabled) {
        setConnectionError("Please enable Location Services in your device settings to scan for WiFi networks");
        console.log("Location services are turned off");
        return;
      }
      
      // Request location permission (required for WiFi scanning)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "We need your location to scan for WiFi networks",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Get current SSID
        try {
          const currentSSID = await WifiManager.getCurrentWifiSSID();
          setSsid(currentSSID);
        } catch (error) {
          console.log("Error getting current SSID:", error);
          // Handle specific errors
          if (error instanceof Error && error.message.includes("Location service is turned off")) {
            setConnectionError("Please enable Location Services in your device settings");
            return;
          }
        }
        
        try {
          // Scan for networks
          const networks = await WifiManager.loadWifiList();
          const uniqueNetworks = [...new Set(networks.map(network => network.SSID))];
          setWifiNetworks(uniqueNetworks.filter(ssid => ssid.length > 0));
          setModalVisible(true);
        } catch (error) {
          console.log("Error loading WiFi list:", error);
          if (error instanceof Error && error.message.includes("Location service is turned off")) {
            setConnectionError("Please enable Location Services in your device settings");
          } else {
            setConnectionError("Error scanning for WiFi networks");
          }
        }
      } else {
        console.log("Location permission denied");
        setConnectionError("Location permission is required to scan for WiFi networks");
      }
    } catch (error) {
      console.log("Error scanning WiFi:", error);
      // Better error handling with specific messages
      if (error instanceof Error) {
        if (error.message.includes("Location service is turned off")) {
          setConnectionError("Please enable Location Services in your device settings");
        } else {
          setConnectionError("Error scanning for WiFi networks: " + error.message);
        }
      } else {
        setConnectionError("Error scanning for WiFi networks");
      }
    } finally {
      setScanning(false);
    }
  };
  
  const connectToWifi = async (ssid: string, password: string) => {
    try {
      setConnectionError("");

      // Connect to the selected network
      const connected = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        false, // isWEP - we assume modern networks use WPA/WPA2, not WEP
        isHiddenNetwork // isHidden - whether this is a hidden network
      );

      console.log("Connected to WiFi:", connected);
      
      if (connected) {
        console.log(`Successfully connected to ${ssid}`);
        next();
      } else {
        console.log(`Failed to connect to ${ssid}`);
        setConnectionError("Failed to connect to the network. Please check your password and try again.");
      }
    } catch (error) {
      console.log("Error connecting to WiFi:", error);
      setConnectionError("Error connecting to the network");
    }
  };


  useEffect(() => {
    // Start scanning for WiFi networks when component mounts
    scanForWifiNetworks();
  }, []);

  console.log(ssid);

  const handleConnect = () => {
    if (selectedWifi && password) {
      console.log("Selected WiFi:", selectedWifi);
      console.log("Password:", password);
      console.log("Hidden network:", isHiddenNetwork);
      connectToWifi(selectedWifi, password);
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
            {scanning ? "Scanning for WiFi networks..." : "Ready to connect"}
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
              style={[styles.scanButton, { backgroundColor: '#4285F4', marginTop: 8 }]}
              onPress={() => {
                // Open device location settings
                // This requires the react-native-android-settings-library package
                // but for now we'll just alert the user
                alert("Please enable Location Services in your device settings, then come back and tap 'Scan for Networks'");
              }}
            >
              <Text style={styles.scanButtonText}>Open Location Settings</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal for WiFi List */}
      <Modal
        animationType="slide"
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
            {selectedWifi ? (
              <View>
                <Text style={styles.selectedWifiText}>
                  Enter password for {selectedWifi}:
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="WiFi Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setIsHiddenNetwork(!isHiddenNetwork)}
                  >
                    {isHiddenNetwork && <View style={styles.checkboxSelected} />}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>This is a hidden network</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#022322',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    backgroundColor: '#022322',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'InterRegular',
    color: '#022322',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'center',
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
    color: "#FFFFFF",
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
    alignItems: 'center',
  },
  header: {
    gap: 8,
    marginBottom: 24,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
    // alignItems: 'center',
    width: '100%',
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "InterRegular",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  imageContainer: {
    width: width - 80,
    height: width - 80,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'center',
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
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    marginVertical: 7,
    fontFamily: "InterBold",
    marginBottom: 10,
  },
  wifiItem: {
    paddingVertical: 15,
  },
  wifiText: {
    fontSize: 16,
    fontFamily: "InterRegular",
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
