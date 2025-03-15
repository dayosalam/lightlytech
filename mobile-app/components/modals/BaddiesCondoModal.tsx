import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BaddiesCondoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  lightsSwitch: boolean;
  setLightsSwitch: (value: boolean) => void;
}

const BaddiesCondoModal: React.FC<BaddiesCondoModalProps> = ({
  visible,
  onClose,
  onSave,
  lightsSwitch,
  setLightsSwitch,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContainerWrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <TouchableOpacity
                style={[styles.closeButton, styles.baddiesCloseButton]}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#878787" />
              </TouchableOpacity>

              {/* Baddie's Condo Header */}
              <View style={styles.baddiesHeader}>
                <View style={styles.baddiesIconContainer}>
                  <Ionicons name="leaf-outline" size={24} color="#34C759" />
                  <View style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={12} color="#000000" />
                  </View>
                </View>
                <Text style={styles.baddiesTitle}>Baddie's Condo</Text>
              </View>

              <View style={styles.baddiesDivider} />

              {/* Lights Section */}
              <View style={styles.timeSection}>
                <View style={styles.scheduleSection}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconContainer}>
                      <Ionicons
                        name="bulb-outline"
                        size={20}
                        color="#022322"
                      />
                      <Text style={styles.sectionTitle}>Lights</Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#022322" />
                  </View>

                  <View style={styles.baddiesDivider} />

                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Start time</Text>
                    <Text style={styles.timeValue}>12:00</Text>
                  </View>

                  <View style={styles.timePickerContainer}>
                    <Text style={styles.timePickerValue}>12</Text>
                    <Text style={styles.timePickerSeparator}>:</Text>
                    <Text style={styles.timePickerValue}>00</Text>
                  </View>

                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>End time</Text>
                    <Text style={styles.timeValue}>18:00</Text>
                  </View>

                  <View style={styles.timePickerContainer}>
                    <Text style={styles.timePickerValue}>18</Text>
                    <Text style={styles.timePickerSeparator}>:</Text>
                    <Text style={styles.timePickerValue}>00</Text>
                  </View>

                  <View style={styles.baddiesDivider} />

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Switch</Text>
                    <Switch
                      value={lightsSwitch}
                      onValueChange={() => setLightsSwitch(!lightsSwitch)}
                      trackColor={{ false: "#D1D1D6", true: "#34C759" }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D6"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.baddiesDivider} />

              {/* Sockets Section */}
              <View style={styles.scheduleSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Ionicons
                      name="power-outline"
                      size={20}
                      color="#022322"
                    />
                    <Text style={styles.sectionTitle}>Sockets</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#022322"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.baddiesSaveButton}
                onPress={onSave}
              >
                <Text style={styles.baddiesSaveButtonText}>
                  Save schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainerWrapper: {
    width: "100%",
    height: "90%",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalContent: {
    padding: 24,
    position: "relative",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  closeButton: {
    padding: 2,
    borderWidth: 1,
    borderColor: "#878787",
    borderRadius: 100,
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 1,
  },
  baddiesCloseButton: {
    backgroundColor: "white",
  },
  baddiesHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  baddiesIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF8E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    padding: 2,
  },
  baddiesTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#022322",
  },
  baddiesDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  timeSection: {
    marginBottom: 16,
  },
  scheduleSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginLeft: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  timeValue: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  timePickerValue: {
    backgroundColor: "#FFF2EB",
    color: "#FF6B00",
    fontSize: 18,
    fontFamily: "InterSemiBold",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  timePickerSeparator: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    paddingHorizontal: 8,
    color: "#8B9A99",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  baddiesSaveButton: {
    backgroundColor: "#022322",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  baddiesSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BaddiesCondoModal;
