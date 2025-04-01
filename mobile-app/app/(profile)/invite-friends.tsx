"use client";

import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Share as RNShare,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Link, Copy } from "lucide-react-native";
import Share from "@/assets/icons/share.svg";

export default function InviteScreen() {
  const [referralCode] = useState("KID45Z");

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
  };

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Use my referral code ${referralCode} to sign up for Lightly and get 2 tokens to start earning rewards!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/lightly-illustration.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Invite a friend</Text>
        <Text style={styles.description}>
          Refer a friend and get{" "}
          <Text style={styles.bold}>2 Lightly tokens</Text> when they sign up!
          Your friend also gets 2 tokens to start earning rewards while managing
          their electricity usage efficiently.
        </Text>

        {/* Referral Code */}
        <View style={styles.codeWrapper}>
          <View style={styles.codeContainer}>
            <Link size={20} color="#000" style={styles.linkIcon} />
            <Text style={styles.code}>{referralCode}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyCode}
          >
            <View style={styles.iconCircle}>
              <Copy size={16} color="#000" />
            </View>
            <Text style={styles.actionText}>Copy code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <View style={styles.iconCircle}>
              <Share color="#000" />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 20,
    height: 200,
  },
  illustration: {
    width: "90%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "InterBold",
    color: "#0A2E36",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    fontFamily: "InterRegular",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  bold: {
    fontFamily: "InterBold",
    color: "#0A2E36",
  },
  codeWrapper: {
    padding: 6,
    backgroundColor: "#E6E9E9",
    marginBottom: 32,
    borderRadius: 12,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  linkIcon: {
    marginRight: 16,
  },
  code: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#0A2E36",
    flex: 1,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 40,
  },
  actionButton: {
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  actionText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#0A2E36",
  },
});
