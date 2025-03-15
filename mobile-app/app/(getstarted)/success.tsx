import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Storage } from "@/utils/storage";

const { width } = Dimensions.get("window");

export default function SuccessScreen() {
  const router = useRouter();
  
  useEffect(() => {
    // Set authentication state when this screen is shown
    const setAuthState = async () => {
      await Storage.setIsAuthenticated(true);
      console.log("User authenticated successfully");
    };
    
    setAuthState();
  }, []);
  
  const handleSetupDevice = async () => {
    // Navigate to device setup screen
    console.log("Navigating to setup screen");
    router.push("/setup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Yay! All good</Text>
          <Text style={styles.description}>
            Your account has been set up with koskiddoo@gmail.com. Now let's set up
            your device with your distribution box
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSetupDevice}
        >
          <Text style={styles.buttonText}>Set my device up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002020",
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
  },
  button: {
    backgroundColor: "#FF5722",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "InterSemiBold",
  },
});
