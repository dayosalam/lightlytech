"use client";

import { useState, useEffect } from "react";
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
import { Storage } from "@/utils/storage";
import { saveCondoName, getUserDetails } from "@/api/profile";

const MAX_LENGTH = 10;

export default function PersonalizeHome() {
  const router = useRouter();
  const [homeName, setHomeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchUserDetails = async () => {
      try {
        setInitialLoading(true);
        setFetchError(null);

        const userDetails = await getUserDetails();

        // Only update state if component is still mounted
        if (isMounted) {
          // Handle case where user might not have a condo_name yet (new users)
          setHomeName(userDetails.condo_name || "");
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error);

        if (isMounted) {
          // For new users or users without profile data, don't show error
          // Just start with empty string and let them enter their home name
          if (
            error.status === 404 ||
            error.message?.includes("not found") ||
            error.message?.includes("No user found")
          ) {
            console.log(
              "User profile not found - likely a new user, starting fresh"
            );
            setHomeName("");
            setFetchError(null);
          } else {
            // Only show error for actual failures (network issues, server errors, etc.)
            setFetchError(
              "Failed to load home details. You can still continue with setup."
            );
            setHomeName("");
          }
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    fetchUserDetails();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSetup = async () => {
    if (homeName.trim()) {
      try {
        setLoading(true);

        // Save the condo name first
        await saveCondoName(homeName.trim());

        // Mark box as connected
        await Storage.setHasConnectedBox(true);

        // Navigate to success page
        router.push("/setup/success");
      } catch (error: any) {
        console.error("Error saving condo name:", error);

        // Show user-friendly error message
        if (error.status === 401) {
          setFetchError("Session expired. Please log in again.");
        } else if (error.isNetworkError) {
          setFetchError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setFetchError("Failed to save home name. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetryFetch = async () => {
    let isMounted = true;

    try {
      setInitialLoading(true);
      setFetchError(null);

      const userDetails = await getUserDetails();

      if (isMounted) {
        setHomeName(userDetails.condo_name || "");
      }
    } catch (error: any) {
      console.error("Error fetching user details:", error);

      if (isMounted) {
        // Same logic as initial fetch - don't show error for new users
        if (
          error.status === 404 ||
          error.message?.includes("not found") ||
          error.message?.includes("No user found")
        ) {
          console.log(
            "User profile not found - likely a new user, starting fresh"
          );
          setHomeName("");
          setFetchError(null);
        } else {
          setFetchError(
            "Failed to load home details. You can still continue with setup."
          );
        }
      }
    } finally {
      if (isMounted) {
        setInitialLoading(false);
      }
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
              placeholder={initialLoading ? "Loading..." : "e.g Ben's Condo"}
              placeholderTextColor="#878787"
              value={homeName}
              onChangeText={handleChangeText}
              maxLength={MAX_LENGTH}
              editable={!initialLoading}
            />
            <Text style={styles.characterCount}>
              {homeName.length}/{MAX_LENGTH}
            </Text>

            {fetchError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{fetchError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetryFetch}
                  disabled={initialLoading}
                >
                  <Text style={styles.retryButtonText}>
                    {initialLoading ? "Loading..." : "Retry"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              homeName.trim() && !initialLoading
                ? styles.saveButtonActive
                : null,
            ]}
            onPress={handleSaveSetup}
            disabled={!homeName.trim() || loading || initialLoading}
          >
            <Text
              style={[
                styles.saveButtonText,
                homeName.trim() && !initialLoading
                  ? styles.saveButtonTextActive
                  : null,
              ]}
            >
              {loading
                ? "Saving..."
                : initialLoading
                ? "Loading..."
                : "Save setup"}
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
  errorContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#E53E3E",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#FFFFFF",
  },
});
