import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { ChevronRight, WifiOff, AlertTriangleIcon } from "lucide-react-native";
import { useState, useEffect } from "react";
import Triangle from "@/assets/icons/alert.svg";
import WifiModal from "@/components/modals/WifiModal";

export default function DeviceDetailsScreen() {
  const [isConnected, setIsConnected] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWifiModalVisible, setIsWifiModalVisible] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [wifiNetworks, setWifiNetworks] = useState<string[]>([
    "Home WiFi",
    "Office Network",
    "Guest WiFi",
    "Cafe Spot",
    "Library WiFi",
    "Airport WiFi",
    "Park WiFi",
    "Community Center WiFi",
    "Gym WiFi",
  ]);

  const handleWifi = () => {
    // Handle connect logic here
    setIsWifiModalVisible(true);
  };
  const handleDisconnect = () => {
    setIsModalVisible(true);
  };

  const handleProceed = () => {
    setIsModalVisible(false);
    setIsConnected(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Device Image */}
      <View style={styles.deviceImageContainer}>
        <Image
          source={require("@/assets/images/lightly-box.png")}
          style={styles.deviceImage}
          resizeMode="contain"
        />
      </View>

      {/* Power Usage Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>All time power usage</Text>
        <View style={styles.powerUsageContainer}>
          <Text style={styles.powerUsageAmount}>₦8,008.04</Text>
          <Text style={styles.powerUsageUnit}>/ 11.89Kw/H</Text>
        </View>
      </View>

      {/* Device Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text
            style={[
              styles.statusActive,
              { color: isConnected ? "green" : "#E53935" },
            ]}
          >
            {isConnected ? "Active" : "Inactive"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Connected rooms</Text>
          <Text style={styles.infoValue}>4 rooms</Text>
        </View>

        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wifi</Text>
          <TouchableOpacity
            style={styles.wifiNameContainer}
            onPress={handleWifi}
          >
            <Text style={styles.infoValue}>Wifi name</Text>
            <ChevronRight size={20} color="#000" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Disconnect Button */}
      <TouchableOpacity style={styles.connectButton} onPress={handleDisconnect}>
        <WifiOff size={20} color={isConnected ? "#E53935" : "green"} />
        <Text
          style={[
            styles.disconnectText,
            { color: isConnected ? "#E53935" : "green" },
          ]}
        >
          {isConnected ? "Disconnect Lightly Box" : "Connect Lightly Box"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Triangle width={45} height={45} color="#E53935" />
              <Text style={styles.modalTitle}>Disconnect Lightly Box</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to disconnect your Lyghtly device? This
                may affect your energy monitoring and control.
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleProceed}
              >
                <Text style={styles.cancelButtonText}>Proceed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.disconnectButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setIsConnected(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <WifiModal
        modalVisible={isWifiModalVisible}
        setModalVisible={setIsWifiModalVisible}
        selectedWifi={selectedWifi}
        setSelectedWifi={setSelectedWifi}
        password={password}
        setPassword={setPassword}
        wifiNetworks={wifiNetworks}
        handleConnect={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    padding: 16,
  },
  deviceImageContainer: {
    alignItems: "center",
    height: 250,
  },
  deviceImage: {
    width: "70%",
    height: "70%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  connectButton: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  // buttonsContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },

  // modalButton: {
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },

  cardTitle: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#888",
    marginBottom: 8,
  },
  powerUsageContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  powerUsageAmount: {
    fontSize: 36,
    fontFamily: "InterBold",
    color: "#0A2E36",
  },
  powerUsageUnit: {
    fontSize: 18,
    fontFamily: "InterRegular",
    color: "#888",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#888",
  },
  statusActive: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#4CAF50",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#0A2E36",
  },
  wifiNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  disconnectText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#E53935",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker background for better focus
  },
  modalContent: {
    backgroundColor: "#fff",
    gap: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 30,
  },
  modalHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#0A2E36",
    textAlign: "center",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 17,
    fontFamily: "InterRegular",
    color: "#888",
    textAlign: "center",
    // marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#0A2E36",
    marginRight: 8,
  },
  disconnectButton: {
    backgroundColor: "#ffff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterSemiBold",
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: "InterRegular",
  },
});
