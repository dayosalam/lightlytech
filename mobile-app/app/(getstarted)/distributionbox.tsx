import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function DistributionBoxScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to next screen
    router.push("/(getstarted)/auth");
  };

  const handlePurchase = () => {
    // Navigate to purchase screen
    // navigation.navigate("Purchase");
  };

  const handleNeedHelp = () => {
    // Navigate to help screen
    // navigation.navigate("Help");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/box.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Distribution box</Text>

        <Text style={styles.description}>
          To experience the full use of the Lightly app you need to have the
          lightly distribution box and it has been installed
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePurchase}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryButtonText}>No, purchase box</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Yes, continue</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleNeedHelp}>
          <Text style={styles.helpText}>Need help</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  imageContainer: {
    width: width - 80,
    height: width - 80,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontFamily: "InterSemiBold",
    color: "#022322",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#878787",
    fontFamily: "InterRegular",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#022322",
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "InterSemiBold",
    textAlign: "center",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#022322",
    fontSize: 16,
    fontFamily: "InterSemiBold",
    textAlign: "center",
  },
  helpText: {
    color: "#ff671f",
    fontSize: 16,
    fontFamily: "InterRegular",
    textAlign: "center",
  },
});
