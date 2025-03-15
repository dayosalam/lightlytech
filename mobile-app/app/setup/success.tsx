import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Storage } from "@/utils/storage";

const { width } = Dimensions.get("window");

export default function SetupSuccess() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Set a timeout to navigate to home after showing the success screen
    const timer = setTimeout(async () => {
      try {
        // Mark that the user has connected their box
        await Storage.setHasConnectedBox(true);

        router.replace("/(home)");
      } catch (error) {
        console.error("Navigation error:", error);
        setShowButton(true);
      }
    }, 3000); // 3 seconds delay

    // Show the manual button after 5 seconds as a fallback
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
    };
  }, [router]);

  const handleManualNavigation = async () => {
    try {
      await Storage.setHasConnectedBox(true);
      router.push("/(home)");
    } catch (error) {
      console.error("Manual navigation error:", error);
      // Try an alternative navigation method
      router.navigate("/(home)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/Loading-2.png")}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.title}>Yay! You made it</Text>
          <Text style={styles.description}>
            You have finished setting up your Lightly box, now relax while we
            build your experience....
          </Text>

          {showButton && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleManualNavigation}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002020",
  },
  imageContainer: {
    marginHorizontal: "auto",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#ffffff",
    marginTop: 30,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "InterRegular",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#002020",
  },
});
