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
} from "react-native";
import AlertCard from "./AlertCard";

const { width } = Dimensions.get("window");

// Sample alert data
const alertData = [
  {
    id: "1",
    message: "Living room is using more energy than usual, save energy now",
    emoji: "😣",
  },
  {
    id: "2",
    message:
      "Kitchen lights have been on for 5 hours, consider turning them off",
    emoji: "💡",
  },
  {
    id: "3",
    message: "You could save ₦5,000 this month by optimizing your energy usage",
    emoji: "💰",
  },
];

const AlertCarousel = () => {
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
        {alertData.map((alert) => (
          <View key={alert.id} style={styles.slide}>
            <AlertCard message={alert.message} emoji={alert.emoji} />
          </View>
        ))}
      </ScrollView>

      {/* Paginator */}
      <View style={styles.paginatorContainer}>
        {alertData.map((_, index) => (
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
  },
  scrollView: {
    width: width,
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
});

export default AlertCarousel;
