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
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Wifi from "@/assets/icons/wifi-complete.svg";
import { Ionicons } from "@expo/vector-icons";

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedWifi, setSelectedWifi] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      const networks = [
        "Home WiFi",
        "Office Network",
        "Guest WiFi",
        "Cafe Spot",
        "Library WiFi",
        "Airport WiFi",
        "Park WiFi",
        "Community Center WiFi",
        "Gym WiFi",
      ];
      setWifiNetworks(networks);
      setModalVisible(true);
    }, 5000);
  }, []);

  const handleConnect = () => {
    next();
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
          <Text style={styles.searchingText}>Searching for WiFi</Text>
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
                />

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
  },
  header: {
    gap: 8,
    marginBottom: 24,
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
