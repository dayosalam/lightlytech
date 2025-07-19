"use client";

import DistributionBox from "@/components/DistributionBox";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useWifi } from "@/context/WifiContext";

export default function ConnectBoxScreen({ next }: { next: () => void }) {
  const {
    scanNetworks,
    networks,
    isScanning,
    error,
    connectToNetwork,
    isConnecting,
  } = useWifi();
  const rippleAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  const [numBoxesFound, setNumBoxesFound] = useState(0);
  type BoxPosition = { top: number; left: number; ssid: string };
  const [boxPositions, setBoxPositions] = useState<BoxPosition[]>([]);
  const boxAnimation = useRef(new Animated.Value(0)).current;
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  // Constants for positioning
  const CONTAINER_SIZE = 400;
  const DISTRIBUTION_BOX_SIZE = 100;
  const MARGIN = 20;

  useEffect(() => {
    // Start ripple animations
    const animations = rippleAnimations.map((anim, index) => {
      return Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
          delay: index * 500,
        })
      ).start();
    });

    // Initial network scan
    scanNetworks();

    // No need for timeout - this will be handled by network scan result

    return () => {
      rippleAnimations.forEach((anim) => {
        // Properly handle animation cleanup
        const animatedLoop = anim as any;
        if (animatedLoop.stop) animatedLoop.stop();
      });
    };
  }, []);

  useEffect(() => {
    // Process networks when they change
    const lightlyBoxNetworks = networks.filter((net) =>
      net.SSID.includes("Lightly Box")
    );
    const foundBoxes = lightlyBoxNetworks.length;

    if (foundBoxes > 0) {
      // Generate positions based on actual found networks
      let positions: BoxPosition[] = [];

      for (let i = 0; i < foundBoxes; i++) {
        const side = getRandomSide();
        const position = getRandomPositionOnSide(side, positions);
        // Store the SSID with the position so we know which network to connect to when clicked
        position.ssid = lightlyBoxNetworks[i].SSID;
        positions.push(position);
      }

      setBoxPositions(positions);
      setNumBoxesFound(foundBoxes);

      Animated.timing(boxAnimation, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    } else {
      // Reset if no Lightly Box networks found
      setBoxPositions([]);
      setNumBoxesFound(0);
    }
    // No cleanup needed in this effect
  }, [networks]);

  const getRandomSide = () => {
    const sides = ["top", "right", "bottom", "left"];
    return sides[Math.floor(Math.random() * sides.length)];
  };

  const getRandomPositionOnSide = (
    side: string,
    existingPositions: BoxPosition[]
  ): BoxPosition => {
    const availableRange = CONTAINER_SIZE - DISTRIBUTION_BOX_SIZE - MARGIN * 2;
    let top: number = 0;
    let left: number = 0;
    let attempts = 0;
    let ssid: string = "";

    do {
      switch (side) {
        case "top":
          top = MARGIN;
          left = MARGIN + Math.random() * availableRange;
          break;
        case "right":
          top = MARGIN + Math.random() * availableRange;
          left = CONTAINER_SIZE - DISTRIBUTION_BOX_SIZE - MARGIN;
          break;
        case "bottom":
          top = CONTAINER_SIZE - DISTRIBUTION_BOX_SIZE - MARGIN;
          left = MARGIN + Math.random() * availableRange;
          break;
        case "left":
          top = MARGIN + Math.random() * availableRange;
          left = MARGIN;
          break;
        default:
          top = CONTAINER_SIZE / 2 - DISTRIBUTION_BOX_SIZE / 2;
          left = CONTAINER_SIZE / 2 - DISTRIBUTION_BOX_SIZE / 2;
      }

      attempts++;
      if (attempts > 10) break; // Avoid infinite loops
    } while (
      existingPositions.some(
        (pos: BoxPosition) =>
          Math.abs(pos.top - top) < DISTRIBUTION_BOX_SIZE &&
          Math.abs(pos.left - left) < DISTRIBUTION_BOX_SIZE
      )
    );

    return { top, left, ssid };
  };

  // Handle clicking on a distribution box
  const handleBoxClick = async (ssid: string) => {
    setConnectionStatus(`Connecting to ${ssid}...`);
    try {
      // Connect to the network with an empty password since there's no password
      const connected = await connectToNetwork(ssid, "", false);

      if (connected) {
        setConnectionStatus(`Connected to ${ssid} successfully!`);
        // Wait a moment before proceeding to the next screen
        setTimeout(() => {
          next();
        }, 1500);
      } else {
        setConnectionStatus(`Failed to connect to ${ssid}. Please try again.`);
      }
    } catch (err) {
      console.error("Error connecting to network:", err);
      setConnectionStatus(`Error connecting to ${ssid}. Please try again.`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Great! Let's connect{"\n"}your device with the{"\n"}lightly box
          </Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {connectionStatus && (
            <Text style={styles.connectionStatusText}>{connectionStatus}</Text>
          )}
          {/* {isConnecting && <Text style={styles.scanningText}>Connecting to Lightly Box...</Text>} */}
        </View>

        <View style={styles.rippleContainer}>
          {rippleAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.rippleCircle,
                {
                  transform: [
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3 + index * 0.2, 0.8 + index * 0.2],
                      }),
                    },
                  ],
                  opacity: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.4, 0.2, 0],
                  }),
                },
              ]}
            />
          ))}
          <View style={styles.iconContainer}>
            <Image source={require("@/assets/images/connect_logo.png")} />
          </View>

          {/* Render found DistributionBox components */}
          {boxPositions.map((position, index) => (
            <Animated.View
              key={index}
              style={[
                styles.distributionBox,
                {
                  top: position.top,
                  left: position.left,
                  transform: [
                    {
                      scale: boxAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                      }),
                    },
                  ],
                  opacity: boxAnimation,
                },
              ]}
            >
              <DistributionBox onClick={() => handleBoxClick(position.ssid)} />
            </Animated.View>
          ))}
        </View>

        <Text style={styles.description}>
          {numBoxesFound > 0 ? (
            <Text>
              <Text style={styles.orangeText}>
                {numBoxesFound} distribution box{numBoxesFound > 1 ? "es" : ""}
              </Text>
              <Text> found nearby, click on one to connect</Text>
            </Text>
          ) : (
            "Looking for lightly distribution box, keeping your device close will assist the connection process."
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 40,
  },
  errorText: {
    color: "#FF0000",
    fontFamily: "InterRegular",
    fontSize: 14,
    marginTop: 8,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
  },
  scanningText: {
    color: "#878787",
    fontFamily: "InterRegular",
    fontSize: 14,
    marginTop: 8,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
  },
  connectionStatusText: {
    color: "#22A45D",
    fontFamily: "InterRegular",
    fontSize: 14,
    marginTop: 8,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
  },
  networksFoundText: {
    color: "#22A45D",
    fontFamily: "InterMedium",
    fontSize: 14,
    marginTop: 8,
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
  },
  rescanButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  rescanButtonText: {
    color: "#FFFFFF",
    fontFamily: "InterSemiBold",
    fontSize: 16,
  },
  orangeText: {
    color: "#FF671F",
    fontFamily: "InterBold",
  },
  titleContainer: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    paddingLeft: Platform.OS === "ios" ? 20 : 0,
  },
  title: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#022322",
    lineHeight: 36,
  },
  rippleContainer: {
    width: 500,
    height: 500,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  rippleCircle: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 10,
    borderColor: "#E6E9E9",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  distributionBox: {
    position: "absolute",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "InterRegular",
    lineHeight: 20,
  },
});
