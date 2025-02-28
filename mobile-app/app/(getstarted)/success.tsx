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

const { width } = Dimensions.get("window");

export default function SuccessScreen() {
  const router = useRouter();
  const handleSetupDevice = () => {
    // Navigate to device setup screen
    router.push("/(connectlightly)");
    // navigation.navigate('DeviceSetup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Yay! All good</Text>
          <Text style={styles.description}>
            Your account as being set with koskiddoo@gmail.com. Now let's set up
            your device with your distribution box
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSetupDevice}>
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
