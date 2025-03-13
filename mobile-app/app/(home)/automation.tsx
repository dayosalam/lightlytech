import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AlertCarousel from "@/components/home/AlertCarousel";
import TimePeriodSelector from "@/components/TimePeriodSelector";
import { router } from "expo-router";

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
  const [lightsSwitch, setLightsSwitch] = useState(true);
  const [socketsSwitch, setSocketsSwitch] = useState(true);

  const handleToggle = (id: string) => {
    setToggles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSchedulePress = (id: string) => {
    router.push(`/schedule-details/index?id=${id}`);
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
    // Handle schedule type selection
    console.log("Selected schedule type:", type);

    if (type === "baddies") {
      openBaddiesModal();
    } else {
      closeScheduleModal();
      // Navigate to schedule creation with the selected type
      router.push(`/schedule-details/index?type=${type}`);
    }
  };

  const saveSchedule = () => {
    closeBaddiesModal();
    console.log(
      "Schedule saved with lights:",
      lightsSwitch,
      "and sockets:",
      socketsSwitch
    );
    // You could navigate to the schedules tab or show a success message
    setActiveTab("Schedules");
  };

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

        <AlertCarousel />

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeScheduleModal}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={closeScheduleModal}>
          <View style={styles.modalContainerWrapper}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set schedule</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeScheduleModal}
                  >
                    <Ionicons name="close" size={24} color="#878787" />
                  </TouchableOpacity>
                </View>

                <View style={styles.scheduleOptions}>
                  {/* Baddie's Condo Option */}
                  <TouchableOpacity
                    style={styles.scheduleOption}
                    onPress={() => handleScheduleTypeSelect("baddies")}
                  >
                    <View style={styles.scheduleOptionContent}>
                      <View style={styles.scheduleOptionIconContainer}>
                        <View style={styles.homeIconContainer}>
                          <Ionicons
                            name="home-outline"
                            size={24}
                            color="#FF671F"
                          />
                        </View>
                        <View style={styles.checkIconContainer}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#34C759"
                          />
                        </View>
                      </View>
                      <Text style={styles.scheduleOptionTitle}>
                        Baddie's Condo
                      </Text>
                      <Text style={styles.scheduleOptionDescription}>
                        All rooms including sockets & lights
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Custom Option */}
                  <TouchableOpacity
                    style={[styles.scheduleOption, styles.customOption]}
                    onPress={() => handleScheduleTypeSelect("custom")}
                  >
                    <View style={styles.scheduleOptionContent}>
                      <View style={styles.scheduleOptionIconContainer}>
                        <View style={styles.addIconContainer}>
                          <Ionicons name="add" size={24} color="#8B9A99" />
                        </View>
                      </View>
                      <Text style={styles.scheduleOptionTitle}>Custom</Text>
                      <Text style={styles.scheduleOptionDescription}>
                        Choose the rooms you want to work with
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Baddies Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={baddiesModalVisible}
        onRequestClose={closeBaddiesModal}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={closeBaddiesModal}>
          <View style={styles.modalContainerWrapper}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <TouchableOpacity
                  style={[styles.closeButton, styles.baddiesCloseButton]}
                  onPress={closeBaddiesModal}
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

                {/* Time Selection */}
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
                  onPress={saveSchedule}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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
    fontFamily: "InterMedium",
    color: "#FF671F",
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
    borderWidth: 1,
    borderColor: "#FFE8E0",
    backgroundColor: "#FFF8F6",
    borderRadius: 16,
    padding: 16,
    height: 150,
  },
  customOption: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
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
    borderWidth: 1,
    borderColor: "#FF671F",
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
});
