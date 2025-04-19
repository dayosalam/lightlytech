import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import User from "@/assets/icons/user.svg";

interface AvatarProps {
  name?: string;
  email?: string;
  edit?: boolean;
  emoji?: string;
  imageUri?: string;
}

const Avatar = ({ 
  name = "Baddie's", 
  email, 
  edit, 
  emoji, 
  imageUri 
}: AvatarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <User width={30} height={30} />
        )}
        {edit && (
          <View style={styles.pencilContainer}>
            <Ionicons name="pencil" size={16} color="#022322" />
          </View>
        )}
      </View>

      {!edit && (
        <>
          <Text style={styles.title}>{name}</Text>
          {email && <Text style={styles.subtitle}>{email}</Text>}
        </>
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 40,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  pencilContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "InterBold",
    color: "#022322",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
  },
  emoji: {
    fontSize: 36,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
