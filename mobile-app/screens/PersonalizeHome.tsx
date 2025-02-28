"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

const MAX_LENGTH = 10;

export default function PersonalizeHome() {
  const router = useRouter();
  const [homeName, setHomeName] = useState("");
  const handleSaveSetup = () => {
    if (homeName.trim()) {
      // Handle save logic here
      router.push("/(connectlightly)/SuccessConnect");
      // navigation.navigate('NextScreen');
    }
  };

  const handleChangeText = (text: string) => {
    if (text.length <= MAX_LENGTH) {
      setHomeName(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Personalize your home</Text>
            <Text style={styles.subtitle}>
              Add a name for your home. You can always edit this on the profile
              page
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g Ben's Condo"
              placeholderTextColor="#878787"
              value={homeName}
              onChangeText={handleChangeText}
              maxLength={MAX_LENGTH}
            />
            <Text style={styles.characterCount}>
              {homeName.length}/{MAX_LENGTH}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              homeName.trim() ? styles.saveButtonActive : null,
            ]}
            onPress={handleSaveSetup}
            disabled={!homeName.trim()}
          >
            <Text
              style={[
                styles.saveButtonText,
                homeName.trim() ? styles.saveButtonTextActive : null,
              ]}
            >
              Save setup
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    color: "#022322",
    fontFamily: "InterBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#878787",
    lineHeight: 24,
    fontFamily: "InterRegular",
  },
  inputContainer: {
    marginTop: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#022322",
    fontFamily: "InterSemiBold",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    fontFamily: "InterRegular",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#022322",
  },
  characterCount: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#878787",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#e6e9e9",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButtonActive: {
    backgroundColor: "#022322",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#878787",
  },
  saveButtonTextActive: {
    color: "#FFFFFF",
  },
});
