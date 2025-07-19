import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AlertCard from "./AlertCard";
import { useAlerts } from "@/hooks/useAlerts";
import { IEnergyAlert } from "@/interfaces";

const { width } = Dimensions.get("window");

// Skeleton loading component
const AlertCardSkeleton = () => {
  // Animation value for the shimmer effect
  const shimmerValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Create a looping animation for the shimmer effect
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        })
      ).start();
    };

    startShimmerAnimation();
    return () => shimmerValue.stopAnimation();
  }, []);

  // Interpolate the animation value to create the shimmer effect
  const shimmerTranslate = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonEmoji} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonText} />
        <View style={[styles.skeletonText, { width: "70%" }]} />
      </View>

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
};

const AlertCarousel = () => {
  const { data: alerts, isLoading } = useAlerts();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);

    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setActiveIndex(index);
  };

  // Render skeletons when loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Render 3 skeleton cards */}
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.slide}>
              <AlertCardSkeleton />
            </View>
          ))}
        </ScrollView>

        {/* Skeleton paginator */}
        <View style={styles.paginatorContainer}>
          {[1, 2, 3].map((item, index) => (
            <View
              key={index}
              style={[
                styles.paginatorDot,
                index === 0 && styles.paginatorDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  // No alerts to display
  if (!alerts || alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noAlertsContainer}>
          <Text style={styles.noAlertsText}>No alerts at the moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {alerts.map((alert: IEnergyAlert) => (
          <View key={alert.id} style={styles.slide}>
            <AlertCard message={alert.message} emoji={alert.emoji} />
          </View>
        ))}
      </ScrollView>

      {/* Paginator */}
      <View style={styles.paginatorContainer}>
        {alerts.map((_: IEnergyAlert, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginatorDot,
              index === activeIndex && styles.paginatorDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  slide: {
    width: width,
    paddingHorizontal: 20,
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginatorDot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#d9d9d9",
    marginHorizontal: 4,
  },
  paginatorDotActive: {
    backgroundColor: "#ff671f", // Orange color for active dot
    width: 16, // Make active dot wider
  },
  // Skeleton styles
  skeletonCard: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    minHeight: 100,
    overflow: "hidden",
    position: "relative",
  },
  skeletonEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 16,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  skeletonTitle: {
    height: 18,
    width: "60%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonText: {
    height: 12,
    width: "90%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmerGradient: {
    flex: 1,
    width: "200%",
  },
  noAlertsContainer: {
    width: width - 40,
    minHeight: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  noAlertsText: {
    fontFamily: "InterMedium",
    color: "#888",
    fontSize: 16,
  },
});

export default AlertCarousel;
