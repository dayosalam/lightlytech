import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

interface RoomSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  rooms: Array<{
    id: string;
    name: string;
    emoji: string;
    backgroundColor: string;
  }>;
  selectedRooms: string[];
  onRoomSelect: (roomId: string) => void;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  visible,
  onClose,
  onContinue,
  rooms,
  selectedRooms,
  onRoomSelect,
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
      height={500}
      openDuration={250}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        draggableIcon: {
          backgroundColor: "#E0E0E0",
          width: 40,
          height: 4,
        },
      }}
      onClose={onClose}
    >
      <View style={styles.roomModalContent}>
        <View style={styles.roomModalHeader}>
          <Text style={styles.roomModalTitle}>Select rooms</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#878787" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.roomSelectionListContainer}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomSelectionItemRow}
              onPress={() => onRoomSelect(room.id)}
            >
              <View style={styles.roomSelectionLeftSide}>
                <View
                  style={[
                    styles.roomIconContainer,
                    { backgroundColor: room.backgroundColor },
                  ]}
                >
                  <Text style={styles.roomEmojiText}>{room.emoji}</Text>
                </View>
                <Text style={styles.roomNameText}>{room.name}</Text>
              </View>

              <View
                style={[
                  styles.roomCheckbox,
                  selectedRooms.includes(room.id) &&
                    styles.roomCheckboxSelected,
                ]}
              >
                {selectedRooms.includes(room.id) && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.continueButtonContainer}
          onPress={onContinue}
        >
          <Text style={styles.continueButtonLabel}>Continue</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  roomModalContent: {
    padding: 20,
    flex: 1,
  },
  closeButton: {
    padding: 2,
    borderColor: "#878787",
    borderWidth: 1,
    borderRadius: 50,
  },
  roomModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  roomModalTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#022322",
  },
  roomSelectionListContainer: {
    flex: 1,
  },
  roomSelectionItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  roomSelectionLeftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomEmojiText: {
    fontSize: 16,
  },
  roomNameText: {
    fontSize: 16,
    color: "#022322",
    fontFamily: "InterSemiBold",
  },
  roomCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  roomCheckboxSelected: {
    backgroundColor: "#FF671F",
    borderWidth: 0,
  },
  continueButtonContainer: {
    backgroundColor: "#022322",
    fontFamily: "InterSemiBold",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RoomSelectionModal;
