"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Storage } from "@/utils/storage";

export default function EmailVerificationScreen() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    // For demo purposes, we'll just navigate to the success screen
    // In a real app, you would verify the code with your backend
    
    // Navigate to the success screen
    router.push("/(getstarted)/success");
  };

  const handleResendCode = () => {
    // Implement resend code logic here
    console.log("Resending verification code");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Verify email</Text>

            <Text style={styles.description}>
              A 4 digit code was sent to{" "}
              <Text style={styles.email}>koskiddoo@gmail.com</Text>.{"\n"}
              Enter the code to verify your email.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter code</Text>
              <TextInput
                style={[
                  styles.input,
                  verificationCode.length === 4 && { borderColor: "#28A745" },
                ]}
                placeholder="4 digit code"
                placeholderTextColor="#A0A0A0"
                keyboardType="number-pad"
                maxLength={4}
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't get the code? </Text>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendButton}>Resend code</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                verificationCode.length === 4 ? styles.verifyButtonActive : {},
              ]}
              onPress={handleVerify}
              // disabled={verificationCode.length !== 4 || isLoading}
            >
              <Text style={styles.verifyButtonText}>
                {isLoading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#0A2E36",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#666",
    lineHeight: 24,
    marginBottom: 32,
  },
  email: {
    color: "#0A2E36",
    fontFamily: "InterSemiBold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#0A2E36",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#0A2E36",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "InterRegular",
  },
  resendButton: {
    fontSize: 14,
    color: "#FF5722",
    fontWeight: "500",
    fontFamily: "InterRegular",
  },
  footer: {
    padding: 24,
    marginTop: "auto",
  },
  verifyButton: {
    backgroundColor: "#B0BEC5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonActive: {
    backgroundColor: "#B0BEC5",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontFamily: "InterSemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
});
