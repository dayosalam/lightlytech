import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

interface InviteFriendsProps {
  tokenAmount: number;
  onInvitePress: () => void;
}

const InviteFriends = ({ tokenAmount, onInvitePress }: InviteFriendsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Invite Friends</Text>
        <Text style={styles.description}>
          Earn {tokenAmount} Lightly tokens by inviting friends
        </Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={onInvitePress}
          activeOpacity={0.7}
        >
          <Text style={styles.inviteButtonText}>Invite Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: "#F26B34",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteButtonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#ffffff",
  },
});
