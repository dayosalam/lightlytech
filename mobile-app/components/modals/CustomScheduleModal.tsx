import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RoomSettings {
  lights: boolean;
  sockets: boolean;
  lightsStartTime: string;
  lightsEndTime: string;
  socketsStartTime: string;
  socketsEndTime: string;
}

interface CustomScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  rooms: Array<{
    id: string;
    name: string;
    emoji: string;
    backgroundColor: string;
  }>;
  selectedRooms: string[];
  roomSettings: Record<string, RoomSettings>;
  expandedRooms: string[];
  expandedOptions: { roomId: string; option: string }[];
  onSave: () => void;
  onRoomExpansion: (roomId: string) => void;
  onOptionExpansion: (roomId: string, option: string) => void;
  onRoomSettingChange: (roomId: string, setting: "lights" | "sockets") => void;
}

const CustomScheduleModal: React.FC<CustomScheduleModalProps> = ({
  visible,
  onClose,
  rooms,
  selectedRooms,
  roomSettings,
  expandedRooms,
  expandedOptions,
  onSave,
  onRoomExpansion,
  onOptionExpansion,
  onRoomSettingChange,
}) => {
  // Helper function to check if an option is expanded
  const isOptionExpanded = (roomId: string, option: string) => {
    return expandedOptions.some(
      (item) => item.roomId === roomId && item.option === option
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.roomModalOverlay}
        onPress={onClose}
      >
        <View
          style={styles.roomModalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.roomModalContent}>
            <View style={styles.roomModalHeader}>
              <Text style={styles.roomModalTitle}>Custom</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

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

            <ScrollView style={styles.roomSelectionListContainer}>
              {rooms
                .filter((room) => selectedRooms.includes(room.id))
                .map((room) => (
                  <View key={room.id}>
                    <TouchableOpacity
                      style={styles.customRoomItem}
                      onPress={() => onRoomExpansion(room.id)}
                    >
                      <View style={styles.roomSelectionLeftSide}>
                        <View
                          style={[
                            styles.roomIconContainer,
                            { backgroundColor: room.backgroundColor },
                          ]}
                        >
                          <Text style={styles.roomEmojiText}>
                            {room.emoji}
                          </Text>
                        </View>
                        <Text style={styles.roomNameText}>{room.name}</Text>
                      </View>

                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: "white" },
                        ]}
                      >
                        <Ionicons
                          name={
                            expandedRooms.includes(room.id)
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={20}
                          color="#8B9A99"
                        />
                      </View>
                    </TouchableOpacity>

                    {expandedRooms.includes(room.id) && (
                      <View style={styles.roomOptionsContainer}>
                        <TouchableOpacity
                          style={styles.roomOptionItem}
                          onPress={() =>
                            onOptionExpansion(room.id, "lights")
                          }
                        >
                          <View style={styles.roomOptionLeft}>
                            <Ionicons
                              name="bulb-outline"
                              size={22}
                              color="#022322"
                            />
                            <Text style={styles.roomOptionText}>Lights</Text>
                          </View>

                          <View
                            style={[
                              styles.iconContainer,
                              { backgroundColor: "#F5F5F5" },
                            ]}
                          >
                            <Ionicons
                              name={
                                isOptionExpanded(room.id, "lights")
                                  ? "chevron-down"
                                  : "chevron-forward"
                              }
                              size={20}
                              color="#8B9A99"
                            />
                          </View>
                        </TouchableOpacity>

                        {isOptionExpanded(room.id, "lights") && (
                          <View style={styles.optionDetailsContainer}>
                            <View style={styles.timeRow}>
                              <Text style={styles.timeLabel}>Start time</Text>
                              <Text style={styles.timeValue}>
                                {roomSettings[room.id].lightsStartTime}
                              </Text>
                            </View>

                            <View style={styles.timePickerContainer}>
                              <Text style={styles.timePickerValue}>12</Text>
                              <Text style={styles.timePickerSeparator}>
                                :
                              </Text>
                              <Text style={styles.timePickerValue}>00</Text>
                            </View>

                            <View style={styles.timeRow}>
                              <Text style={styles.timeLabel}>End time</Text>
                              <Text style={styles.timeValue}>
                                {roomSettings[room.id].lightsEndTime}
                              </Text>
                            </View>

                            <View style={styles.timePickerContainer}>
                              <Text style={styles.timePickerValue}>18</Text>
                              <Text style={styles.timePickerSeparator}>
                                :
                              </Text>
                              <Text style={styles.timePickerValue}>00</Text>
                            </View>

                            <View style={styles.switchRow}>
                              <Text style={styles.switchLabel}>Switch</Text>
                              <Switch
                                value={roomSettings[room.id].lights}
                                onValueChange={() =>
                                  onRoomSettingChange(room.id, "lights")
                                }
                                trackColor={{
                                  false: "#D9D9D9",
                                  true: "#022322",
                                }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#D9D9D9"
                              />
                            </View>
                          </View>
                        )}

                        <TouchableOpacity
                          style={styles.roomOptionItem}
                          onPress={() =>
                            onOptionExpansion(room.id, "sockets")
                          }
                        >
                          <View style={styles.roomOptionLeft}>
                            <Ionicons
                              name="flash-outline"
                              size={22}
                              color="#022322"
                            />
                            <Text style={styles.roomOptionText}>Sockets</Text>
                          </View>
                          <View
                            style={[
                              styles.iconContainer,
                              { backgroundColor: "#F5F5F5" },
                            ]}
                          >
                            <Ionicons
                              name={
                                isOptionExpanded(room.id, "sockets")
                                  ? "chevron-down"
                                  : "chevron-forward"
                              }
                              size={20}
                              color="#8B9A99"
                            />
                          </View>
                        </TouchableOpacity>

                        {isOptionExpanded(room.id, "sockets") && (
                          <View style={styles.optionDetailsContainer}>
                            <View style={styles.timeRow}>
                              <Text style={styles.timeLabel}>Start time</Text>
                              <Text style={styles.timeValue}>
                                {roomSettings[room.id].socketsStartTime}
                              </Text>
                            </View>

                            <View style={styles.timePickerContainer}>
                              <Text style={styles.timePickerValue}>12</Text>
                              <Text style={styles.timePickerSeparator}>
                                :
                              </Text>
                              <Text style={styles.timePickerValue}>00</Text>
                            </View>

                            <View style={styles.timeRow}>
                              <Text style={styles.timeLabel}>End time</Text>
                              <Text style={styles.timeValue}>
                                {roomSettings[room.id].socketsEndTime}
                              </Text>
                            </View>

                            <View style={styles.timePickerContainer}>
                              <Text style={styles.timePickerValue}>18</Text>
                              <Text style={styles.timePickerSeparator}>
                                :
                              </Text>
                              <Text style={styles.timePickerValue}>00</Text>
                            </View>

                            <View style={styles.switchRow}>
                              <Text style={styles.switchLabel}>Switch</Text>
                              <Switch
                                value={roomSettings[room.id].sockets}
                                onValueChange={() =>
                                  onRoomSettingChange(room.id, "sockets")
                                }
                                trackColor={{
                                  false: "#D9D9D9",
                                  true: "#022322",
                                }}
                                thumbColor={"#FFFFFF"}
                                ios_backgroundColor="#D9D9D9"
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.continueButtonContainer}
              onPress={onSave}
            >
              <Text style={styles.continueButtonLabel}>Save schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  roomModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  roomModalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  roomModalContent: {
    padding: 20,
    flex: 1,
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
    bottom: 10,
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
    marginBottom: 16,
  },
  roomSelectionListContainer: {
    flex: 1,
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
    fontFamily: "InterSemiBold",
  },
  customRoomItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 1,
    paddingHorizontal: 12,
  },
  roomOptionsContainer: {
    paddingVertical: 16,
    marginBottom: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  roomOptionItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  roomOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomOptionText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    marginLeft: 12,
  },
  iconContainer: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  optionDetailsContainer: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
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
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
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

export default CustomScheduleModal;
