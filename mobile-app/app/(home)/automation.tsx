import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AlertCarousel from "@/components/home/AlertCarousel";
import TimePeriodSelector from "@/components/TimePeriodSelector";
import { router } from "expo-router";
import {
  RoomSelectionModal,
  CustomScheduleModal,
  ScheduleTypeModal,
  BaddiesCondoModal,
} from "@/components/modals";
import { sendInstruction } from "@/api/automation";

// Room data
const roomsData = [
  {
    id: "1",
    name: "Living room",
    emoji: "😊",
    usage: "N12/9Kw/H · 52% usage",
    backgroundColor: "#E6F2FF",
  },
  {
    id: "2",
    name: "Room 1",
    emoji: "😘",
    usage: "N12/9Kw/H · 52% usage",
    backgroundColor: "#FFEEE6",
  },
  {
    id: "3",
    name: "Restroom (Room 1)",
    emoji: "♟️",
    usage: "N12/9Kw/H · 52% usage",
    backgroundColor: "#F5F5F5",
  },
  {
    id: "4",
    name: "Restroom (Room 1)",
    emoji: "♟️",
    usage: "N12/9Kw/H · 52% usage",
    backgroundColor: "#F5F5F5",
  },
];

// Schedule data
const schedulesData = [
  {
    id: "1",
    name: "Baddies Condo",
    emoji: "😊",
    status: "Active",
    backgroundColor: "#E6F2FF",
  },
  {
    id: "2",
    name: "Room 1",
    emoji: "😘",
    status: "",
    backgroundColor: "#FFEEE6",
  },
  {
    id: "3",
    name: "Restroom (Room 1)",
    emoji: "♟️",
    status: "",
    backgroundColor: "#F5F5F5",
  },
  {
    id: "4",
    name: "Restroom (Room 1)",
    emoji: "♟️",
    status: "",
    backgroundColor: "#F5F5F5",
  },
];

// Define a type for the toggles state
interface TogglesState {
  [key: string]: boolean;
}

export default function AutomationScreen() {
  const [activeTab, setActiveTab] = useState("Controls");
  const [toggles, setToggles] = useState<TogglesState>({
    "1": true,
    "2": true,
    "3": true,
    "4": true,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [baddiesModalVisible, setBaddiesModalVisible] = useState(false);
  const [roomSelectionModalVisible, setRoomSelectionModalVisible] =
    useState(false);
  const [customScheduleModalVisible, setCustomScheduleModalVisible] =
    useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<
    string | null
  >(null);
  const [lightsSwitch, setLightsSwitch] = useState(true);
  const [socketsSwitch, setSocketsSwitch] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const [expandedOptions, setExpandedOptions] = useState<
    { roomId: string; option: string }[]
  >([]);
  const [roomSettings, setRoomSettings] = useState<
    Record<
      string,
      {
        lights: boolean;
        sockets: boolean;
        lightsStartTime: string;
        lightsEndTime: string;
        socketsStartTime: string;
        socketsEndTime: string;
      }
    >
  >({});

  const handleToggle = async (id: string) => {
    // Update the toggle state in the UI
    const newValue = !toggles[id];
    setToggles((prev) => ({
      ...prev,
      [id]: newValue,
    }));
    
    try {
      // Create an array of relay states based on the current toggles state
      // Each index represents a room/relay (0-3)
      const relayStates = [
        toggles["1"] ? 1 : 0,
        toggles["2"] ? 1 : 0,
        toggles["3"] ? 1 : 0,
        toggles["4"] ? 1 : 0,
      ];
      
      // Update the specific relay that was toggled
      relayStates[parseInt(id) - 1] = newValue ? 1 : 0;
      
      console.log(`Sending relay states: ${relayStates.join(', ')}`);
      
      // Call the API to send the instruction with all relay states
      const response = await sendInstruction(relayStates);
      console.log('Instruction sent successfully:', response);
    } catch (error) {
      console.error('Failed to send instruction:', error);
      // Optionally revert the toggle if the instruction fails
      // setToggles((prev) => ({ ...prev, [id]: !newValue }));
    }
  };

  const handleSchedulePress = (id: string) => {
    router.push(`/schedule-details?id=${id}`);
  };

  const openScheduleModal = () => {
    setModalVisible(true);
  };

  const closeScheduleModal = () => {
    setModalVisible(false);
  };

  const openBaddiesModal = () => {
    closeScheduleModal();
    setBaddiesModalVisible(true);
  };

  const closeBaddiesModal = () => {
    setBaddiesModalVisible(false);
  };

  const handleScheduleTypeSelect = (type: string) => {
    setSelectedScheduleType(type);
    if (type === "baddies") {
      setModalVisible(false);
      setBaddiesModalVisible(true);
    } else if (type === "custom") {
      setModalVisible(false);
      setRoomSelectionModalVisible(true);
    }
  };

  const closeRoomSelectionModal = () => {
    setRoomSelectionModalVisible(false);
  };

  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const continueWithSelectedRooms = () => {
    closeRoomSelectionModal();
    // Initialize room settings for selected rooms
    const initialSettings: Record<
      string,
      {
        lights: boolean;
        sockets: boolean;
        lightsStartTime: string;
        lightsEndTime: string;
        socketsStartTime: string;
        socketsEndTime: string;
      }
    > = {};
    selectedRooms.forEach((roomId) => {
      initialSettings[roomId] = {
        lights: true,
        sockets: true,
        lightsStartTime: "12:00",
        lightsEndTime: "18:00",
        socketsStartTime: "12:00",
        socketsEndTime: "18:00",
      };
    });
    setRoomSettings(initialSettings);
    // Expand the first room by default if any rooms are selected
    if (selectedRooms.length > 0) {
      setExpandedRooms([selectedRooms[0]]);
    }
    // Show the custom schedule modal instead of navigating
    setCustomScheduleModalVisible(true);
  };

  const closeCustomScheduleModal = () => {
    setCustomScheduleModalVisible(false);
    setExpandedRooms([]);
    setExpandedOptions([]);
  };

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const toggleOptionExpansion = (roomId: string, option: string) => {
    setExpandedOptions((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.roomId === roomId && item.option === option
      );
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { roomId, option }];
      }
    });
  };

  const isOptionExpanded = (roomId: string, option: string) => {
    return expandedOptions.some(
      (item) => item.roomId === roomId && item.option === option
    );
  };

  const toggleRoomSetting = (roomId: string, setting: "lights" | "sockets") => {
    setRoomSettings((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [setting]: !prev[roomId][setting],
      },
    }));
  };

  const saveCustomSchedule = () => {
    closeCustomScheduleModal();
    console.log("Custom schedule saved with rooms and settings:", roomSettings);
    // You could navigate to the schedules tab or show a success message
    setActiveTab("Schedules");
  };

  const saveSchedule = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Automation</Text>
          {activeTab === "Schedules" && (
            <TouchableOpacity onPress={openScheduleModal}>
              <Text style={styles.createScheduleButton}>Create schedule</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.alertCarouselContainer}>
          <AlertCarousel />
        </View>

        {/* Tab Navigation */}
        <TimePeriodSelector
          selectedTimeOption={activeTab}
          setSelectedTimeOption={setActiveTab}
          options={["Controls", "Schedules"]}
        />

        {/* Room List */}
        <View style={styles.roomList}>
          {activeTab === "Controls"
            ? roomsData.map((room) => (
                <View key={room.id} style={styles.roomItem}>
                  <View style={styles.roomInfo}>
                    <View
                      style={[
                        styles.emojiContainer,
                        { backgroundColor: room.backgroundColor },
                      ]}
                    >
                      <Text style={styles.emoji}>{room.emoji}</Text>
                    </View>
                    <View style={styles.roomDetails}>
                      <Text style={styles.roomName}>{room.name}</Text>
                      <Text style={styles.roomUsage}>{room.usage}</Text>
                    </View>
                  </View>
                  <Switch
                    value={toggles[room.id]}
                    onValueChange={() => handleToggle(room.id)}
                    trackColor={{ false: "#D1D1D6", true: "#34C759" }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D1D6"
                    style={styles.switch}
                  />
                </View>
              ))
            : schedulesData.map((schedule) => (
                <TouchableOpacity
                  onPress={() => handleSchedulePress(schedule.id)}
                  key={schedule.id}
                  style={styles.scheduleItem}
                >
                  <View style={styles.roomInfo}>
                    <View
                      style={[
                        styles.emojiContainer,
                        { backgroundColor: schedule.backgroundColor },
                      ]}
                    >
                      <Text style={styles.emoji}>{schedule.emoji}</Text>
                    </View>
                    <View style={styles.roomDetails}>
                      <Text style={styles.roomName}>{schedule.name}</Text>
                    </View>
                  </View>
                  <View style={styles.scheduleStatus}>
                    {schedule.status && (
                      <Text style={styles.activeStatus}>{schedule.status}</Text>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#8B9A99"
                    />
                  </View>
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>

      {/* Schedule Modal */}
      <ScheduleTypeModal
        visible={modalVisible}
        onClose={closeScheduleModal}
        selectedScheduleType={selectedScheduleType}
        onScheduleTypeSelect={handleScheduleTypeSelect}
      />

      {/* Room Selection Modal */}
      <RoomSelectionModal
        visible={roomSelectionModalVisible}
        onClose={closeRoomSelectionModal}
        onContinue={continueWithSelectedRooms}
        rooms={roomsData}
        selectedRooms={selectedRooms}
        onRoomSelect={toggleRoomSelection}
      />

      {/* Custom Schedule Modal */}
      <CustomScheduleModal
        visible={customScheduleModalVisible}
        onClose={closeCustomScheduleModal}
        onSave={saveCustomSchedule}
        rooms={roomsData}
        selectedRooms={selectedRooms}
        roomSettings={roomSettings}
        expandedOptions={expandedOptions}
        expandedRooms={expandedRooms}
        onRoomExpansion={toggleRoomExpansion}
        onOptionExpansion={toggleOptionExpansion}
        isOptionExpanded={isOptionExpanded}
        onRoomSettingChange={toggleRoomSetting}
      />

      {/* Baddies Condo Modal */}
      <BaddiesCondoModal
        visible={baddiesModalVisible}
        onClose={closeBaddiesModal}
        onSave={saveSchedule}
        lightsSwitch={lightsSwitch}
        setLightsSwitch={setLightsSwitch}
      />
    </SafeAreaView>

    // <View style={styles.container}>
    //   <Text style={[styles.title, { marginLeft: 16 }]}>Automation</Text>
    //   <Text className="text-gray-500 text-center my-auto font-[InterSemiBold] text-[16px]">Coming Soon...</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
  },
  createScheduleButton: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#FF671F",
  },
  alertCarouselContainer: {
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    overflow: "hidden",
  },
  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  alertText: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
    flex: 1,
    marginRight: 12,
  },
  alertEmoji: {
    fontSize: 24,
  },
  iconContainer: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  alertButton: {
    backgroundColor: "#FF671F",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  alertButtonText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
  },
  activeTabButton: {
    backgroundColor: "#022322",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#8B9A99",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  roomList: {
    marginTop: 16,
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  roomDetails: {
    justifyContent: "center",
  },
  roomName: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  roomUsage: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  scheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeStatus: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
    marginRight: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainerWrapper: {
    width: "100%",
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
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
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
  checkIconContainer: {
    alignItems: "flex-end",
  },
  sectionIconContainer: {
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
  baddiesOptions: {
    marginBottom: 24,
  },
  baddiesOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  baddiesOptionTitle: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  saveButton: {
    backgroundColor: "#FF671F",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#FFFFFF",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 16,
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
  scheduleSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginRight: 8,
  },
  timeSection: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
  },
  timeValue: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  timePickerValue: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#FF671F",
    backgroundColor: "#FFF0E9",
    borderRadius: 8,
    padding: 10,
  },
  timePickerSeparator: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#D6D6D6",
    marginHorizontal: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8B9A99",
  },
  baddiesSaveButton: {
    backgroundColor: "#022322",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  baddiesSaveButtonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#FFFFFF",
  },
  baddiesCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  // Room Selection Modal Styles
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
  roomSelectionListContainer: {
    flex: 1,
    // backgroundColor: "#F5F5F5",
  },
  roomSelectionItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
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
  roomCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  roomCheckboxSelected: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
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
});
