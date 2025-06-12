import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";  

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const isLogin = authMode === "login";

  const router = useRouter();

  const handleSubmit = async () => {
    if (authMode === "login") {
      console.log("Login with email:", email, "and password:", password);
      router.push("/(setup)/index");
    } else {
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}></View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Enter your email address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.textInput}
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="At least 8 Characters"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Ionicons name="eye-off" size={20} color="#888" style={styles.icon} />
            ) : (
              <Ionicons name="eye" size={20} color="#888" style={styles.icon} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Login and Navigation */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <Pressable
          onPress={() => setAuthMode(isLogin ? "signup" : "login")}
          style={{ marginLeft: 5 }}
        >
          <Text style={[styles.link, { color: "black" }]}>
            {isLogin ? "Sign up" : "Log in"}
          </Text>
        </Pressable>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>
          {isLogin ? "Log in" : "Sign up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../assets/images/google_symbol.svg.png")}
          style={styles.googleImage}
        />
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB", // Light background
    paddingHorizontal: 20,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 20,
  },
  googleImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333", // Darker text
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#C4C4C4", // Placeholder gray color
    borderRadius: 40,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333", // Darker text
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    height: 50,
  },
  icon: {
    marginHorizontal: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    padding: 0,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    marginBottom: 10,
  },
  link: {
    color: "#797979",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#000", // Black background
    width: 300,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  orLine: {
    width: 50,
    height: 1,
    backgroundColor: "#DADADA",
  },
  orText: {
    color: "#888",
    fontSize: 14,
    marginVertical: 10,
    marginHorizontal: 10,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#000000",
    backgroundColor: "transparent",
    width: 300,
    height: 50,
    borderRadius: 40,
  },
});

export default Index;
