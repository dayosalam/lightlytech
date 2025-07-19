import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "@/assets/icons/home.svg";
import RBSheet from "react-native-raw-bottom-sheet";

interface ScheduleTypeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedScheduleType: string | null;
  onScheduleTypeSelect: (type: string) => void;
}

const ScheduleTypeModal: React.FC<ScheduleTypeModalProps> = ({
  visible,
  onClose,
  selectedScheduleType,
  onScheduleTypeSelect,
}) => {
  const rbSheetRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      // Use setTimeout to avoid the useInsertionEffect warning
      const timer = setTimeout(() => {
        rbSheetRef.current?.open();
      }, 0);
      return () => clearTimeout(timer);
    } else {
      // Close when visible becomes false
      rbSheetRef.current?.close();
    }
  }, [visible]);

  const handleClose = () => {
    rbSheetRef.current?.close();
    // onClose();
  };

  return (
    <RBSheet
      ref={rbSheetRef}
      height={300}
      openDuration={250}
      closeDuration={200}
      closeOnPressMask={true}
      onClose={onClose}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        draggableIcon: {
          backgroundColor: "#E0E0E0",
          width: 40,
          height: 4,
        },
        container: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: "white",
        },
      }}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Schedule Type</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={20} color="#878787" />
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleOptions}>
          {/* Baddie's Condo Option */}
          <TouchableOpacity
            style={[
              styles.scheduleOption,
              selectedScheduleType === "baddies" && styles.selectedOption,
            ]}
            onPress={() => onScheduleTypeSelect("baddies")}
          >
            <View style={styles.scheduleOptionContent}>
              <View style={styles.scheduleOptionIconContainer}>
                <View style={styles.homeIconContainer}>
                  <Home />
                </View>
                {selectedScheduleType === "baddies" && (
                  <View style={styles.checkIconContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#FF671F"
                    />
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.scheduleOptionTitle}>Baddie's Condo</Text>
                <Text style={styles.scheduleOptionDescription}>
                  Automatically control your home based on your preferences
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Custom Option */}
          <TouchableOpacity
            style={[
              styles.scheduleOption,
              selectedScheduleType === "custom" && styles.selectedOption,
            ]}
            onPress={() => onScheduleTypeSelect("custom")}
          >
            <View style={styles.scheduleOptionContent}>
              <View style={styles.scheduleOptionIconContainer}>
                <View
                  style={[
                    styles.addIconContainer,
                    selectedScheduleType === "custom" && {
                      backgroundColor: "#FF671F",
                      borderWidth: 0,
                    },
                  ]}
                >
                  <Ionicons
                    name={"add"}
                    size={24}
                    color={
                      selectedScheduleType === "custom" ? "white" : "#878787"
                    }
                  />
                </View>
                {selectedScheduleType === "custom" && (
                  <View style={styles.checkIconContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#FF671F"
                    />
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.scheduleOptionTitle}>Custom</Text>
                <Text style={styles.scheduleOptionDescription}>
                  Create your own schedule for specific rooms and devices
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
  },
  closeButton: {
    padding: 2,
    borderWidth: 1,
    borderColor: "#878787",
    borderRadius: 100,
  },
  scheduleOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  scheduleOption: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    height: 150,
  },
  selectedOption: {
    borderColor: "#FFE8E0",
    backgroundColor: "#FFF8F6",
  },
  scheduleOptionContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  scheduleOptionIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  homeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIconContainer: {
    alignItems: "flex-end",
  },
  scheduleOptionTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 8,
  },
  scheduleOptionDescription: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
    lineHeight: 20,
  },
});

export default ScheduleTypeModal;
