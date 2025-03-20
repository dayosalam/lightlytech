import { StyleSheet, Text, View, Switch, ScrollView } from "react-native";
import React, { useState } from "react";

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationOption[]>([
    {
      id: "energy_usage",
      title: "Energy usage",
      description: "Stay informed about your power consumption and avoid unnecessary energy waste.",
      enabled: true,
    },
    {
      id: "device_control",
      title: "Device & Control",
      description: "Manage your appliances efficiently and stay updated on device performance.",
      enabled: true,
    },
    {
      id: "rewards",
      title: "Rewards",
      description: "Get notified for energy-saving achievements and bonuses.",
      enabled: true,
    },
  ]);

  const toggleSwitch = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Notifications</Text>
          
          <View style={styles.notificationList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "#e0e0e0", true: "#34C759" }}
                  thumbColor={"#ffffff"}
                  ios_backgroundColor="#e0e0e0"
                  onValueChange={() => toggleSwitch(notification.id)}
                  value={notification.enabled}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "90%",
    maxWidth: 500,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "left",
  },
  notificationList: {
    width: "100%",
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: "100%",
  },
  notificationContent: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
    lineHeight: 20,
  },
});
