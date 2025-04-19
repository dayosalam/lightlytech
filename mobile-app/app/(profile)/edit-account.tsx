import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Avatar from "@/components/profile/Avatar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";

const { height } = Dimensions.get("window");

const EditAccount = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const uploadModalAnimation = useRef(new Animated.Value(height)).current;
  const emojiModalAnimation = useRef(new Animated.Value(height)).current;
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(
    undefined
  );
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined
  );

  // Initial user data - would typically come from context or API
  const [formData, setFormData] = useState({
    firstName: user?.name || "",
    homeName: user?.condo_name || "",
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
    console.log("Selected emoji:", selectedEmoji);
    console.log("Selected image URI:", selectedImageUri);

    // Navigate back to account screen
    router.back();
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    Animated.timing(uploadModalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeUploadModal = () => {
    Animated.timing(uploadModalAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowUploadModal(false);
    });
  };

  const openEmojiModal = () => {
    setShowEmojiModal(true);
    Animated.timing(emojiModalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeEmojiModal = () => {
    Animated.timing(emojiModalAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEmojiModal(false);
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setSelectedImageUri(undefined); // Clear any selected image
    closeEmojiModal();
  };

  const pickImage = async () => {
    closeUploadModal();

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setSelectedEmoji(undefined); // Clear any selected emoji
    }
  };

  // Array of emojis for the grid
  const emojis = [
    "🎁",
    "♟️",
    "📱",
    "🎯",
    "🎄",
    "🎁",
    "🖼️",
    "🎭",
    "🎀",
    "🔮",
    "🍰",
    "🎁",
    "🌟",
    "🚀",
    "🎨",
    "🎮",
    "🎸",
    "🎬",
    "🏆",
    "⚽",
    "🏀",
    "🎾",
    "🎱",
    "🏈",
    "🍕",
    "🍔",
    "🍦",
    "🍩",
    "🍫",
    "🍿",
    "🐶",
    "🐱",
    "🐼",
    "🦁",
    "🐯",
    "🦊",
  ];

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

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.avatarSection}
          onPress={openUploadModal}
        >
          <Avatar
            edit={true}
            emoji={selectedEmoji}
            imageUri={selectedImageUri}
          />
        </TouchableOpacity>

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
{/* 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="e.g doe"
              placeholderTextColor="#8b9a99"
            />
          </View> */}

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

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Update changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Upload Image Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeUploadModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeUploadModal}
          />
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: uploadModalAnimation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload image</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeUploadModal}
              >
                <Ionicons name="close" size={24} color="#878787" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  closeUploadModal();
                  setTimeout(openEmojiModal, 300);
                }}
              >
                <View style={styles.emojiCircle}>
                  <Ionicons name="happy-outline" size={24} color="#022322" />
                </View>
                <Text style={styles.modalOptionText}>Use emoji</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                <View style={styles.galleryCircle}>
                  <Ionicons name="images-outline" size={24} color="#022322" />
                </View>
                <Text style={styles.modalOptionText}>Choose from gallery</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Emoji Selection Modal */}
      <Modal
        visible={showEmojiModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeEmojiModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeEmojiModal}
          />
          <Animated.View
            style={[
              styles.modalContainer,
              styles.emojiModalContainer,
              { transform: [{ translateY: emojiModalAnimation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose emoji</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeEmojiModal}
              >
                <Ionicons name="close" size={24} color="#878787" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.emojiGrid}>
              <View style={styles.emojiGridContent}>
                {emojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiItem}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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
    fontFamily: "InterSemiBold",
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
  closeButton: {
    borderWidth: 1,
    borderColor: "#878787",
    borderRadius: "100%",
    padding: 4,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 200,
  },
  emojiModalContainer: {
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#022322",
  },
  modalContent: {
    paddingVertical: 10,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  galleryCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  emojiGrid: {
    flex: 1,
  },
  emojiGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  emojiItem: {
    width: "16.66%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 24,
  },
});
