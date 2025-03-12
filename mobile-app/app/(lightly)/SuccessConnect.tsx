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

export default function SuccessConnect() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Set a timeout to navigate to home after showing the success screen
    const timer = setTimeout(async () => {
      try {
        await Storage.setHasSeenOnboarding(true);
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
      await Storage.setHasSeenOnboarding(true);
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
            You have finish setting up your account, now relax while we build
            your experience....
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
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  textContainer: {
    marginVertical: "auto",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontFamily: "InterBold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    fontFamily: "InterRegular",
    color: "#AAAAAA",
    lineHeight: 28,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "InterSemiBold",
  },
});
