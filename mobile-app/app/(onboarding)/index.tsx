import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { onboardingSteps } from "@/constants/data";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = onboardingSteps.length;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(currentPage, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [currentPage]);

  const renderPaginatorDots = () => {
    return onboardingSteps.map((_, i) => (
      <View
        key={i}
        style={[
          styles.paginatorDot,
          i === currentPage ? styles.paginatorDotActive : null,
        ]}
      />
    ));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.push("/auth");
    }
  };

  const handleSkip = () => {
    router.push("/auth");
  };

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [currentPage - 1, currentPage, currentPage + 1],
      [0, 1, 0]
    );
    const translateY = interpolate(
      animationProgress.value,
      [currentPage - 1, currentPage, currentPage + 1],
      [20, 0, -20]
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [currentPage - 1, currentPage, currentPage + 1],
      [0, 1, 0]
    );
    const translateY = interpolate(
      animationProgress.value,
      [currentPage - 1, currentPage, currentPage + 1],
      [20, 0, -20]
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [currentPage - 0.5, currentPage, currentPage + 0.5],
      [0, 1, 0]
    );
    const scale = interpolate(
      animationProgress.value,
      [currentPage - 1, currentPage, currentPage + 1],
      [0.8, 1, 0.8]
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.paginatorContainer}>{renderPaginatorDots()}</View>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <IconSymbol name="chevron.right" size={24} color="black" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.Text style={[styles.title, titleStyle]}>
          {onboardingSteps[currentPage].title}
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {onboardingSteps[currentPage].description}
        </Animated.Text>

        <Animated.View style={imageStyle}>
          <ExpoImage
            source={onboardingSteps[currentPage].image}
            style={styles.illustration}
            contentFit="cover"
          />
        </Animated.View>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {currentPage < totalPages - 1 ? "Continue" : "Get Started"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 70,
  },
  paginatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 4,
  },
  paginatorDotActive: {
    backgroundColor: "#000",
    width: 40,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "InterRegular",
    marginRight: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: "InterBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "InterLight",
  },
  illustration: {
    width: width - 40,
    height: (width - 40) * 0.75,
    backgroundColor: "#E5E5E5",
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#000",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: width - 80,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "InterSemiBold",
  },
});
