"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Image as ExpoImage,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { onboardingSteps } from "@/constants/data";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Storage } from "@/utils/storage";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.4;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = onboardingSteps.length;
  const translateX = useSharedValue(0);

  const updateCurrentPage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleNext = useCallback(async () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      translateX.value = withTiming(-newPage * width, { duration: 300 });
    } else {
      await Storage.setHasSeenOnboarding(true);
      router.replace("/(getstarted)/distributionbox");
    }
  }, [currentPage, totalPages, translateX, router]);

  const handleSkip = useCallback(async () => {
    await Storage.setHasSeenOnboarding(true);
    router.replace("/(getstarted)/distributionbox");
  }, [router]);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.startX + event.translationX;
      translateX.value = Math.max(
        Math.min(newTranslateX, 0),
        -width * (totalPages - 1)
      );
    },
    onEnd: (event) => {
      const currentOffset = Math.abs(translateX.value);
      const targetPage = Math.round(currentOffset / width);

      if (
        Math.abs(event.velocityX) > 500 ||
        Math.abs(event.translationX) > SWIPE_THRESHOLD
      ) {
        if (event.velocityX > 0 && currentPage > 0) {
          // Swipe right
          translateX.value = withTiming(-(targetPage - 1) * width, {
            duration: 300,
          });
          runOnJS(updateCurrentPage)(targetPage - 1);
        } else if (event.velocityX < 0 && currentPage < totalPages - 1) {
          // Swipe left
          translateX.value = withTiming(-(targetPage + 1) * width, {
            duration: 300,
          });
          runOnJS(updateCurrentPage)(targetPage + 1);
        } else {
          // Bounce back
          translateX.value = withTiming(-targetPage * width, { duration: 300 });
        }
      } else {
        // Snap to nearest page
        translateX.value = withTiming(-targetPage * width, { duration: 300 });
        runOnJS(updateCurrentPage)(targetPage);
      }
    },
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      flexDirection: "row",
      width: width * totalPages,
      transform: [{ translateX: translateX.value }],
    };
  });

  const renderPaginatorDots = useCallback(() => {
    return onboardingSteps.map((_, i) => (
      <View
        key={i}
        style={[
          styles.paginatorDot,
          i === currentPage ? styles.paginatorDotActive : null,
        ]}
      />
    ));
  }, [currentPage]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <View style={styles.paginatorContainer}>{renderPaginatorDots()}</View>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={contentStyle}>
            {onboardingSteps.map((step, index) => (
              <View key={index} style={styles.slide}>
                <ExpoImage
                  source={step.image}
                  style={styles.illustration}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{step.title}</Text>
                  <Text style={styles.subtitle}>{step.description}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.bottomContainer}>
          <Pressable onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>
              {currentPage < totalPages - 1 ? "Continue" : "Get Started"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    backgroundColor: Colors.secondary,
    width: 40,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    color: "#878787",
    fontFamily: "InterRegular",
    marginRight: 4,
  },
  slide: {
    width,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    color: Colors.primary,
    marginBottom: 12,
    lineHeight: 32,
    textAlign: "center",
    fontFamily: "InterBold",
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.body,
    width: 400,
    lineHeight: 30,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "InterLight",
    paddingHorizontal: 30,
  },
  illustration: {
    width: width - 80,
    height: (width - 80) * 0.8,
    alignSelf: "center",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "InterSemiBold",
  },
});
