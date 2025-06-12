import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Wifi from "@/assets/icons/wifi-complete.svg";

interface WifiModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedWifi: string | null;
  setSelectedWifi: (wifi: string | null) => void;
  password: string;
  setPassword: (password: string) => void;
  wifiNetworks: string[];
  handleConnect: () => void;
}

const WifiModal = ({
  modalVisible,
  setModalVisible,
  selectedWifi,
  setSelectedWifi,
  password,
  setPassword,
  wifiNetworks,
  handleConnect,
}: WifiModalProps) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      statusBarTranslucent
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
  );
};

const styles = StyleSheet.create({
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  wifiItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default WifiModal;
