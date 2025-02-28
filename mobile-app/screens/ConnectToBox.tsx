"use client";

import DistributionBox from "@/components/DistributionBox";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";

export default function ConnectBoxScreen({ next }: { next: () => void }) {
  const rippleAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  const [numBoxesFound, setNumBoxesFound] = useState(0);
  const [boxPositions, setBoxPositions] = useState([]);
  const boxAnimation = useRef(new Animated.Value(0)).current;

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

    // Simulate finding distribution boxes
    const findTimeout = setTimeout(() => {
      const foundBoxes = Math.floor(Math.random() * 3) + 1; // Randomly find 1 to 3 boxes
      let positions = [];

      for (let i = 0; i < foundBoxes; i++) {
        const side = getRandomSide();
        const position = getRandomPositionOnSide(side, positions);
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
    }, Math.random() * 3000 + 3000);

    return () => {
      clearTimeout(findTimeout);
      rippleAnimations.forEach((anim) => anim.stop && anim.stop()); // Ensure stop() exists
    };
  }, []);

  const getRandomSide = () => {
    const sides = ["top", "right", "bottom", "left"];
    return sides[Math.floor(Math.random() * sides.length)];
  };

  const getRandomPositionOnSide = (side, existingPositions) => {
    const availableRange = CONTAINER_SIZE - DISTRIBUTION_BOX_SIZE - MARGIN * 2;
    let top, left;
    let attempts = 0;

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
        (pos) =>
          Math.abs(pos.top - top) < DISTRIBUTION_BOX_SIZE &&
          Math.abs(pos.left - left) < DISTRIBUTION_BOX_SIZE
      )
    );

    return { top, left };
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Great! Let's connect{"\n"}your device with the{"\n"}lightly box
          </Text>
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
              <DistributionBox onClick={() => next()} />
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
  orangeText: {
    color: "#FF671F",
    fontFamily: "InterBold",
  },
  titleContainer: {
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontFamily: "InterBold",
    color: "#022322",
    lineHeight: 36,
  },
  rippleContainer: {
    width: 400,
    height: 400,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
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
