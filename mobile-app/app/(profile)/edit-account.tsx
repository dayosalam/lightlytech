import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Avatar from "@/components/profile/Avatar";
import { useRouter } from "expo-router";

const EditAccount = () => {
  const router = useRouter();

  // Initial user data - would typically come from context or API
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    homeName: "",
  });

  const MAX_HOME_NAME_LENGTH = 10;

  const handleChange = (field: string, value: string) => {
    if (field === "homeName" && value.length > MAX_HOME_NAME_LENGTH) {
      return; // Don't update if exceeding max length
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your API
    console.log("Saving user data:", formData);

    // Navigate back to account screen
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.heading}>Edit account</Text>

        <View style={styles.avatarSection}>
          <Avatar edit={true} />
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
              placeholder="e.g john"
              placeholderTextColor="#8b9a99"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="e.g doe"
              placeholderTextColor="#8b9a99"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home name</Text>
            <TextInput
              style={[
                styles.input,
                styles.input,
                formData.homeName.length === MAX_HOME_NAME_LENGTH &&
                  styles.complete,
              ]}
              value={formData.homeName}
              onChangeText={(value) => handleChange("homeName", value)}
              placeholder="baddie's condo"
              placeholderTextColor="#8b9a99"
              autoCapitalize="none"
            />
            <Text style={styles.charCount}>
              {formData.homeName.length}/{MAX_HOME_NAME_LENGTH}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Update changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  complete: {
    borderColor: "#022322",
    borderWidth: 1.5,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 24,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontFamily: "InterMedium",
    color: "#022322",
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#022322",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  charCount: {
    position: "absolute",
    left: 0,
    bottom: -20,
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
  },
  saveButton: {
    backgroundColor: "#022322",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterSemiBold",
  },
});
