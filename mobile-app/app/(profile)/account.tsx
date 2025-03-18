import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Avatar from "@/components/profile/Avatar";

const AccountInfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? "—"}</Text>
    </View>
  );
};

const Account = () => {
  // This would typically come from your user context or API
  const userInfo = {
    name: "Baddie's Condo",
    email: "koskiddoo@gmail.com",
    firstName: null,
    lastName: null,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Account information</Text>

      <View style={styles.profileSection}>
        <Avatar name={userInfo.name} />
      </View>

      <View style={styles.infoSection}>
        <AccountInfoItem label="First name" value={userInfo.firstName} />
        <AccountInfoItem label="Last name" value={userInfo.lastName} />
        <AccountInfoItem label="Email" value={userInfo.email} />
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 24,
  },
  infoSection: {
    paddingVertical: 8,
  },
  infoItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
});
