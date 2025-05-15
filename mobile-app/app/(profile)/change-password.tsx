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
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "@/api/auth";

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert("Error", "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert("Error", "New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword(newPassword);
      console.log(response);
      Alert.alert("Success", "Your password has been updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }

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
            <Text style={styles.heading}>Change password</Text>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#8b9a99"
                    secureTextEntry={!showCurrentPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Ionicons
                      name={
                        showCurrentPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={24}
                      color="#8b9a99"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#8b9a99"
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color="#8b9a99"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.changeButton,
              (!currentPassword || !newPassword) && styles.disabledButton,
              isLoading && styles.loadingButton,
            ]}
            onPress={handleChangePassword}
            disabled={!currentPassword || !newPassword || isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.changeButtonText}>
              {isLoading ? "Updating..." : "Change password"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;

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
