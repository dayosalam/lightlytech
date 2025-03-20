import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const ChangeEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeEmail = () => {
    if (!email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Your email has been updated successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/(getstarted)/verify-email"),
        },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>Change email</Text>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Enter email</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#8b9a99"
                  />
                  <Text style={styles.emailText}>
                    Please provide your current email address
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.changeButton,
              !email && styles.disabledButton,
              isLoading && styles.loadingButton,
            ]}
            onPress={handleChangeEmail}
            disabled={!email || isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.changeButtonText}>
              {isLoading ? "Updating..." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 500,
    paddingTop: 16,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "left",
  },
  formSection: {
    width: "100%",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 8,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  emailText: {
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "#8b9a99",
    marginTop: 4,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 50, // Space for the eye icon
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 13,
    zIndex: 1,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 16,
    alignSelf: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  changeButton: {
    backgroundColor: "#022322",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: "#8b9a99",
    opacity: 0.7,
  },
  loadingButton: {
    backgroundColor: "#034545",
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterSemiBold",
  },
});
