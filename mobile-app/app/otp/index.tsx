import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import OTPInput from "@/components/OtpInput";

// OTP Screen
const OTPScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyOTP = async (otp: string) => {
    try {
      const response = await fetch("https://your-api.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();

      if (response.ok) {
        // router.push("/dashboard");
        console.log("OTP verified successfully");
      } else {
        setErrorMessage(data.message || "Invalid OTP");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.title}>We sent you a code</Text>
      <Text style={styles.subtitle}>Enter it to verify {email ?? "email"}</Text>
      <OTPInput onComplete={handleVerifyOTP} style={{ marginBottom: 30 }} />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.mailText}>Didn't receive mail?</Text>
          <Pressable onPress={() => console.log("Resend OTP")}>
            <Text style={styles.resendText}>Resend</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#C4C4C4", // Placeholder gray color
    borderRadius: 40,
    marginBottom: 40,
  },
  mailText: {
    fontSize: 16,
    fontFamily: "InterLight",
    color: "#000",
  },
  resendText: {
    color: "#000",
    fontFamily: "InterBold",
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "InterSemiBold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#000",
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: "#000",
    width: 300,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default OTPScreen;
