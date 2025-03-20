"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Storage } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleContinue = async () => {
    try {
      setError(null);
      setIsLoading(true);
      // console.log("Attempting to login with:", email);

      // if (!email || !password) {
      //   setError("Email and password are required");
      //   setIsLoading(false);
      //   return;
      // }

      // await login({ email, password });
      // console.log("Login successful, navigating to home");
      // router.push("/(getstarted)/verify-email");
      router.push("/(home)");
    } catch (error: any) {
      console.error("Error logging in:", error.message || error);
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Handle Google sign in
    console.log("Google Sign In");

    // For demo purposes, set as authenticated
    await Storage.setIsAuthenticated(true);

    // Check if user has connected their box
    const hasConnectedBox = await Storage.getHasConnectedBox();

    if (hasConnectedBox) {
      // If box is already connected, navigate to home
      router.replace("/(home)");
    } else {
      // If box is not connected, navigate to setup
      router.replace("/setup");
    }
  };

  const handleNeedHelp = () => {
    // Navigate to help screen
    // navigation.navigate('Help');
  };

  const handleGetDevice = () => {
    // Navigate to device screen
    router.push("/(getstarted)/distributionbox");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={handleNeedHelp}>
                  <Text style={styles.helpText}>Need help</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGetDevice}>
                  <Text style={styles.deviceText}>Get device</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Let's get you started</Text>
              <Text style={styles.subtitle}>
                Create an account to get started with your Lightly app.
              </Text>

              {/* Form */}
              <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocused === "email" && styles.onFocus,
                    error && styles.inputError,
                  ]}
                  placeholder="e.g johndoe@gmail.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsFocused("email")}
                  onBlur={() => setIsFocused(null)}
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      isFocused === "password" && styles.onFocus,
                      error && styles.inputError,
                    ]}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError(null);
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setIsFocused("password")}
                    onBlur={() => setIsFocused(null)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#878787"
                    />
                  </TouchableOpacity>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleContinue}
                  disabled={isLoading}
                >
                  <Text style={styles.continueText}>
                    {isLoading ? "Connecting..." : "Continue"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or get started with</Text>
                <View style={styles.divider} />
              </View>

              {/* Social Sign In */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
              >
                <Image
                  source={{
                    uri: "https://developers.google.com/identity/images/g-logo.png",
                  }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleText}>Google</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.termsText}>
                By signing up, you agree to the{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Data Processing Agreement</Text>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpText: {
    color: "#ff671f",
    fontFamily: "InterSemiBold",
    fontSize: 16,
    marginRight: 16,
  },
  deviceText: {
    color: "#022322",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "InterRegular",
    color: "#878787",
    marginBottom: 30,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 8,
  },
  onFocus: {
    borderWidth: 2,
    borderColor: "#022322",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: "InterRegular",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e6e9e9",
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e9e9",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
    fontFamily: "InterRegular",
  },
  eyeIcon: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#b1bbba",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "InterSemiBold",
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#d6d6d6",
  },
  dividerText: {
    color: "#878787",
    paddingHorizontal: 10,
    fontFamily: "InterRegular",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e6e9e9",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#022322",
    fontFamily: "InterSemiBold",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  termsText: {
    textAlign: "center",
    fontFamily: "InterRegular",
    color: "#878787",
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: "#ff671f",
    fontFamily: "InterSemiBold",
  },
  errorText: {
    color: "#ff3b30",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
