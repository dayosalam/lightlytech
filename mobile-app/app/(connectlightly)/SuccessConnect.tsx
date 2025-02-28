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

const { width } = Dimensions.get("window");

export default function SuccessConnect() {
  const router = useRouter();
  const handleSetupDevice = () => {
    // Navigate to device setup screen
    router.push("/(connectlightly)/index");
    // navigation.navigate('DeviceSetup');
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
